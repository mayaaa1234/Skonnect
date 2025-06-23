const uploadPopup = (): string => {
  return `
      <div class="upload-popup-overlay council" id="council-upload-popup-overlay">
        <div class="upload-popup council">
          <div class="popup-header">
            <h2 class="gradient-text">Upload Images</h2>
            <p class="upload-note muted-2">
              <span class="text-warn">For this to work:</span> <br />
              supported files: png, jpg, jpeg, webp<br />
              max images: 15 (this is for server storage considerations)
            </p>
            <!-- <button id="close-upload-popup">&times;</button> -->
          </div>

          <form id="council-upload-form">
            <div class="dp-f gp-10">
              <!-- <label for="caption" class="upload-caption-label as-fe"> Caption: </label> -->
            </div>


            <div class="drop-zone council" id="drop-zone-council">
              <p>Drop the file here or click to upload</p>
              <input
                type="file"
                id="image-upload-council"
                accept=".jpg,.jpeg,.png,.webp"
                multiple
                required
              />
              <div class="img-preview-container"></div>
            </div>

            <button class="upload-btn br-20" type="submit">Upload</button>
          </form>
        </div>
      </div>
    `;
};

export default uploadPopup;
