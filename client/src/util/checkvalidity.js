export function CheckValidity(file, filelist, items, counter) {
    if (file.type != 'application/pdf') {
        // check file type
        alert(`Only PDF files are available!`);
        return false;
    } else if (file.size > (1048576 * 5)) {
        // check file size
        alert(`File: [${file.name}] is too big! (File size must not exceed 5 MB in size.)`);
        return false;
        // } else if () {
        // check the file consist of at least 95% of English
    } else {
        var redundancy = 0;
        filelist.forEach(element => {
            if (element.file.name == file.name) {
                // check file redundancy
                alert(`File: [${file.name}] is already uploaded`);
                redundancy = 1;
            }
        });
        if (redundancy) return false;
        else return true;
    }
}