exports.handler = async (event) => {
  // モジュールの読み込み
  const sharp = require('sharp');

  // Base64をBufferに変換
  const imageBase64 = event.image;
  let imageBuffer = Buffer.from(imageBase64, 'base64');

  // ===========================
  //          変換処理
  // ===========================
  let err = false;
  // リサイズ処理
  if (event.resize) {
    await sharp(imageBuffer)
      .resize(event.width, event.height, {
        fit: event.fit,
        position: event.position,
        background: event.background,
      })
      .toBuffer()
      .then((res) => {
        imageBuffer = res;
      })
      .catch((error) => {
        console.log(error);
        err = true;
      });
  }

  // フォーマット変換
  if (!(event.original && !event.optimization)) {
    // JPEGを最適化
    if (event.optimization && event.type === 'jpeg') {
      await sharp(imageBuffer)
        .jpeg({ quality: 80 })
        .toBuffer()
        .then((res) => {
          imageBuffer = res;
        })
        .catch((error) => {
          console.log(error);
          err = true;
        });
    }

    // JPEG変換
    else if (event.format === 'jpeg') {
      await sharp(imageBuffer)
        .jpeg({ quality: event.level })
        .toBuffer()
        .then((res) => {
          imageBuffer = res;
        })
        .catch((error) => {
          console.log(error);
          err = true;
        });
    }

    // PNG変換
    else if (event.format === 'png' && event.type !== 'png') {
      await sharp(imageBuffer)
        .png({ progressive: true })
        .toBuffer()
        .then((res) => {
          imageBuffer = res;
        })
        .catch((error) => {
          console.log(error);
          err = true;
        });
    }

    // WebP変換
    else if (event.format === 'webp') {
      if (event.lossless) {
        await sharp(imageBuffer)
          .webp({ lossless: true })
          .toBuffer()
          .then((res) => {
            imageBuffer = res;
          })
          .catch((error) => {
            console.log(error);
            err = true;
          });
      } else {
        await sharp(imageBuffer)
          .webp({ quality: event.level })
          .toBuffer()
          .then((res) => {
            imageBuffer = res;
          })
          .catch((error) => {
            console.log(error);
            err = true;
          });
      }
    }

    // GIF変換
    else if (event.format === 'gif' && event.type !== 'gif') {
      await sharp(imageBuffer)
        .gif()
        .toBuffer()
        .then((res) => {
          imageBuffer = res;
        })
        .catch((error) => {
          console.log(error);
          err = true;
        });
    }

    // TIFF変換（未使用）
    /* else if(event.format === 'tiff') {
        await sharp(imageBuffer)
            .tiff( { quality : event.level } )
            .toBuffer()
            .then( res => {
                imageBuffer = res;
            })
            .catch(error => {
              err = true;
            });
    } */

    // AVIF変換
    else if (event.format === 'avif') {
      if (event.lossless) {
        await sharp(imageBuffer)
          .avif({ lossless: true })
          .toBuffer()
          .then((res) => {
            imageBuffer = res;
          })
          .catch((error) => {
            console.log(error);
            err = true;
          });
      } else {
        await sharp(imageBuffer)
          .avif({ quality: event.level })
          .toBuffer()
          .then((res) => {
            imageBuffer = res;
          })
          .catch((error) => {
            console.log(error);
            err = true;
          });
      }
    }

    // HEIF変換（未使用）
    /* else if (event.format === "heif") {
      if (event.lossless) {
        await sharp(imageBuffer)
          .heif({ lossless: true })
          .toBuffer()
          .then((res) => {
            imageBuffer = res;
          })
          .catch((error) => {
            err = true;
          });
      } else {
        await sharp(imageBuffer)
          .heif({ quality: event.level })
          .toBuffer()
          .then((res) => {
            imageBuffer = res;
          })
          .catch((error) => {
            err = true;
          });
      }
    } */
  }

  if (err) {
    // レスポンス
    const response = {
      statusCode: 500,
      errorMessage: 'Error in conversion process',
    };
    return response;
  } else {
    // BufferからBase64に変換
    const responseImage = Buffer.from(imageBuffer).toString('base64');

    // レスポンス
    const response = {
      statusCode: 200,
      body: JSON.stringify({ image: responseImage }),
    };
    return response;
  }
};
