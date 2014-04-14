ko.bindingHandlers.fileSize = {
    update: function (element, valueAccessor) {
        var size = valueAccessor();
        var textSizes = [" B", " KB", " MB", " GB"];
        var index = 0;

        while (size > 1024) {
            size = size / 1024;
            index += 1;
        }

        var formattedFileSize = size.toFixed(2) + textSizes[index];

        $(element).text(formattedFileSize);
    }
};

var FileViewModel = function (file) {
    this.file = file;
    this.uploadStatus = ko.observable();
    this.uploadPersentage = ko.observable();
    this.uploadResultIcon = ko.observable();

    this.ajax = new XMLHttpRequest();
    this.ajax.upload.addEventListener("progress", $.proxy(this.onProgressChanged, this), false);
    this.ajax.addEventListener("load", $.proxy(this.onFileUploadSuccess,this), false);
    this.ajax.addEventListener("error", $.proxy(this.onFileUploadFailed,this), false);
    this.ajax.addEventListener("abort", $.proxy(this.onFileUploadAbort,this), false);

    this.startUpload = function () {
        var formData = new window.FormData();
        formData.append(this.file.name, this.file);

        this.ajax.open("POST", "/File/Upload");
        this.ajax.send(formData);
    };
};

FileViewModel.prototype.startUpload = function () {
    var formData = new window.FormData();
    formData.append(this.file.name, this.file);
    
    this.ajax.open("POST", "/File/Upload");
    this.ajax.send(formData);
};

FileViewModel.prototype.onProgressChanged = function (e) {
    var persentage = (e.loaded / e.total) * 100;
    this.uploadPersentage(Math.round(persentage));
};

FileViewModel.prototype.onFileUploadSuccess = function (e) {
    this.uploadStatus("File successfully uploaded!");
    this.uploadPersentage(Math.round(0));
    this.uploadResultIcon("https://cdn1.iconfinder.com/data/icons/icojoy/noshadow/standart/gif/24x24/001_06.gif");
};

FileViewModel.prototype.onFileUploadFailed = function (e) {
    this.uploadStatus("File upload failed!");
    this.uploadResultIcon("https://cdn1.iconfinder.com/data/icons/icojoy/shadow/standart/png/24x24/001_05.png");
    console.error(e);
};

FileViewModel.prototype.onFileUploadAbort = function (e) {
    this.uploadStatus("File upload aborted!");
    this.uploadResultIcon("https://cdn1.iconfinder.com/data/icons/icojoy/shadow/standart/png/24x24/001_05.png");
    console.error(e);
};

var MainViewModel = function () {
    this.title = "Select your upload files";
    this.selectedFiles = ko.observableArray();
};

MainViewModel.prototype.onFilesSelected = function (viewModel, evt) {
    this.selectedFiles([]);
    ko.utils.arrayForEach(evt.target.files, function (file) {
        this.selectedFiles.push(new FileViewModel(file));
    }.bind(this));
};

MainViewModel.prototype.start = function () {
    ko.utils.arrayForEach(this.selectedFiles(), function (fileViewModel) {
        fileViewModel.startUpload();
    }.bind(this));
};

ko.applyBindings(new MainViewModel());