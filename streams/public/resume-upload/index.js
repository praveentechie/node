function uploadFile() {
  let uploader = new Uploader(document.getElementById('fileUpload').files[0]);
  uploader.upload();
}


function Uploader (file) {
  this.file = file;
}

Uploader.prototype.upload = function () {
  let formData = new FormData();
  console.log(this.file);
  formData.append('file', this.file);
  formData.append('fileName', this.file.name);

  console.log('formData', formData);
  fetch('/v1/file-upload/upload/stream', {
    method: 'POST',
    headers: {
      'x-file-id': this.file.name
    },
    body: formData
  });
}
