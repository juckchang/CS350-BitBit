from flask import Flask, request, flash, json, jsonify
from uuid import uuid4
import fitz

app = Flask(__name__)

@app.route('/api/upload', methods=['POST'])
def upload_file():
  if 'file' not in request.files:
    return jsonify(status='fail', message='No file uploaded')

  file = request.files['file']
  
  if file.filename == '':
    return jsonify(status='fail', message='No file uploaded')

  if file.filename.split('.').pop() != 'pdf':
    return jsonify(status='fail', message='File is not pdf')

  filename = uuid4()
  file.save(f'upload/{filename}.pdf')
  return jsonify(status='ok', message=f'{filename}.pdf')

if __name__ == '__main__':
  app.run()