from flask import Flask, request, flash, json, jsonify, send_file, send_from_directory
from summarizer import Summarizer
from uuid import uuid4, UUID
from email.encoders import encode_base64
from email.header import Header
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formatdate

import smtplib
import string
import os
import fitz
import re
import spacy

app = Flask(__name__, static_folder='../client/build')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
  if path != "" and os.path.exists(app.static_folder + '/' + path):
    return send_from_directory(app.static_folder, path)
  else:
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/upload', methods=['POST'])
def upload_file():
  if 'file' not in request.files:
    return jsonify(status='fail', message='No file uploaded'), 500

  file = request.files['file']

  if file.filename == '':
    return jsonify(status='fail', message='No file uploaded'), 500

  if file.filename.split('.').pop() != 'pdf':
    return jsonify(status='fail', message='File is not pdf'), 500

  filename = uuid4()
  file.save(f'upload/{filename}.pdf')
  return jsonify(status='ok', message=f'{filename}.pdf'), 200

@app.route('/api/summarize', methods=['POST'])
def summarize():
  if not request.is_json:
    return jsonify(status='fail', message='Not json request'), 500
  data = request.get_json()

  if 'files' not in data or 'option' not in data:
    return jsonify(status='fail', message='File list not provided'), 500

  files = data['files']
  option = data['option']

  if option not in [0, 1, 2]:
    return jsonify(status='fail', message='option is 0, 1, 2'), 500

  if len(files) == 0 or type(files) != list:
    return jsonify(status='fail', message='File not provided'), 500

  if len(files) > 5:
    return jsonify(status='fail', message='File maxium is 5'), 500

  files = [file.replace('..', '').replace('/', '') for file in files]

  if 0 in [file.split('.').pop() == 'pdf' for file in files]:
    return jsonify(status='fail', message='File is not pdf'), 500

  if 0 in [os.path.exists(f'upload/{file}') for file in files]:
    return jsonify(status='fail', message='File not exists'), 500

  text = ''
  try:
    for file in files:
      with fitz.open(f'upload/{file}') as doc:
        for page in doc:
          text += page.get_text()
  except Exception as e:
    print(e)
    return jsonify(status='fail', message='error to open pdf'), 500
  
  count = 0
  count += sum([text.count(x) for x in string.printable])
  if count / len(text) < 0.95:
    return jsonify(status='fail', message='English text must be 95%'), 500
  
  def generatePDF(text, keyword):
    text = f'keyword: {keyword}\n\n' + text
    filename = uuid4()
    doc = fitz.open()
    page = doc.new_page()
    fill_rect = fitz.Rect(0, 0, 1920, 1080)
    tw = fitz.TextWriter(page.rect)
    tw.fill_textbox(fill_rect, text, align=fitz.TEXT_ALIGN_LEFT)
    tw.write_text(page)
    doc.save(f'result/{filename}.pdf')
    return filename

  try:
    nlp = spacy.load("en_core_sci_lg")
    doc = nlp(text)
    keyword = doc.ents[0]
    if option == 0:
      filename = generatePDF(text, keyword)
    elif option == 1:
      summarize = model(text, num_sentences=1)
      filename = generatePDF(summarize, keyword)
    elif option == 2:
      summarize = model(text, num_sentences=5)
      filename = generatePDF(summarize, keyword)
  except Exception as e:
    print(e)
    return jsonify(status='fail', message='error to summaize'), 500
    
  for file in files:
    os.unlink(f'upload/{file}')

  return jsonify(status='ok', message=f'{filename}.pdf'), 200

@app.route('/api/download', methods=['POST'])
def download():
  if not request.is_json:
    return jsonify(status='fail', message='Not json request'), 500
  data = request.get_json()

  if 'file' not in data:
    return jsonify(status='fail', message='File list not provided'), 500

  file = data['file']

  file = file.replace('..', '').replace('/', '')

  if file.split('.').pop() != 'pdf':
    return jsonify(status='fail', message='File is not pdf'), 500

  if not os.path.exists(f'result/{file}'):
    return jsonify(status='fail', message='File not exists'), 500

  return send_file(f'result/{file}', mimetype='application/pdf', download_name='summarize.pdf')

@app.route('/<filename>.pdf', methods=['GET'])
def viewFile(filename):
  try:
    UUID(filename)
    return send_file(f'result/{filename}.pdf', mimetype='application/pdf', download_name='summarize.pdf')
  except ValueError:
    return jsonify(status='fail', message='not valid uuid'), 500

@app.route('/api/delete/<filename>.pdf', methods=['GET'])
def deleteFile(filename):
  try:
    UUID(filename)
    os.unlink(f'./result/{filename}.pdf')
    return jsonify(status='ok', message=f'deleted {filename}.pdf'), 200
  except ValueError:
    return jsonify(status='fail', message='not valid uuid'), 500
  except Exception as e:
    return jsonify(status='fail', message='not valid file'), 500

@app.route('/api/sendEmail', methods=['POST'])
def sendEmail():
  if not request.is_json:
    return jsonify(status='fail', message='Not json request'), 500
  data = request.get_json()

  if 'file' not in data or 'email' not in data:
    return jsonify(status='fail', message='File list not provided'), 500

  file = data['file']
  email = data['email']

  file = file.replace('..', '').replace('/', '')

  if not re.fullmatch('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}', email):
    return jsonify(status='fail', message='not email'), 500

  if not os.path.exists(f'result/{file}'):
    return jsonify(status='fail', message='File not exists'), 500

  msg = MIMEMultipart()

  msg['From'] = 'bitbitcs350@gmail.com'
  msg['To'] = email
  msg['Date'] = formatdate(localtime=True)
  msg['Subject'] = Header(s='Summaize Result', charset='utf-8')
  body = MIMEText('check submit file', _charset='utf-8')
  msg.attach(body)

  part = MIMEBase('application', "octet-stream")
  part.set_payload(open(f'result/{file}', "rb").read())
  encode_base64(part)
  part.add_header('Content-Disposition', 'attachment; filename="summarize.pdf"')
  msg.attach(part)

  mailServer = smtplib.SMTP('smtp.gmail.com', 587)
  mailServer.ehlo()
  mailServer.starttls()
  mailServer.login('bitbitcs350@gmail.com', 'pxycwayhdlqtnhyp')  # 본인 계정과 비밀번호 사용.
  mailServer.send_message(msg)
  mailServer.quit()

  os.unlink(f'./result/{file}')

  return jsonify(status='ok', message=f'send'), 200


if __name__ == '__main__':
  model = Summarizer()
  app.run(port=9911)