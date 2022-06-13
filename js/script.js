// Fetching DOM elements
const uploadAreaForm = document.querySelector('.upload-area');
const uploadInput = document.querySelector('.upload-input');
const progressWrapper = document.querySelector('.progress-list');
const progressHeading = document.querySelector('.heading');
const uploadedWrapper = document.querySelector('.uploaded-list');
let uploadedHTML = ''
let file;
uploadAreaForm.addEventListener('click', () => {
    uploadInput.click();
});
uploadAreaForm.addEventListener('dragover', (event) => {
    event.preventDefault();
});
uploadAreaForm.addEventListener('drop', (event) => {
    event.preventDefault();
    file = event.dataTransfer.files[0];
    if(file) {
        let fileName = file.name;
        if(fileName.length >= 10) {
            let shorteningName = fileName.split('.');
            fileName = shorteningName[0].substring(0,10) + '...' + shorteningName[shorteningName.length -1];
        }
        uploading(fileName,file);
    }
});
uploadInput.addEventListener('change', (event) => {
    let target = event.target;
    file = target.files[0];
    if(file) {
        let fileName = file.name;
        if(fileName.length >= 10) {
            let shorteningName = fileName.split('.');
            fileName = shorteningName[0].substring(0,10) + '...' + shorteningName[shorteningName.length -1];
        }
        uploading(fileName,file);
    }
});
const uploading = (fileName,file) => {
    let xhr = new XMLHttpRequest();
    let fileSizeLoaded;
    let fileSizeTotal;
    let uploadingHTML = ''
    let fileSize_mb_kb;
    xhr.open('POST', 'php/upload.php');
    xhr.upload.addEventListener('progress', (event) => {   
        fileSizeLoadedPercent = Math.floor((event.loaded / event.total) * 100);
        fileSizeTotalInKb = Math.floor(event.total / 1000);
        if (fileSizeTotalInKb < 1024) {
            fileSize_mb_kb = fileSizeTotalInKb + ' KB';
        } else {
            fileSize_mb_kb = (fileSizeTotalInKb / (1024)).toFixed(2) + ' MB';
        }
        uploadingHTML = `
            <h3 class="heading">Uploading</h3>
            <li>
                <div class="details">
                    <p class="name">${fileName}</p>
                    <p class="percentage">${fileSizeLoadedPercent} %</p>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${fileSizeLoadedPercent}%"></div>
                </div>
            </li>
        `;
        progressWrapper.innerHTML = uploadingHTML;
        if(event.loaded === event.total) {     
            progressWrapper.innerHTML = "";
            uploadedHTML = `
            <li>
                <div class="details">
                    <p class="name">${fileName}</p>
                    <p class="size">${fileSize_mb_kb}</p>
                </div>
            </li>    
            ` + uploadedHTML;
            uploadedWrapper.innerHTML = '<h3 class="heading">Uploaded</h3>' + uploadedHTML;
        }
    });
    let fd = new FormData();
    fd.append('file', file);
    console.log(fd.getAll('file'));
    xhr.send(fd);
}; 