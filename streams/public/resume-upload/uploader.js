function Uploader (file) {
  this.file = file;
}

Uploader.prototype.upload = function () {
  let formData = new FormData();
  formData.append('file', this.file);

  fetch('/upload/stream', { method: 'POST', body: formData });
}
