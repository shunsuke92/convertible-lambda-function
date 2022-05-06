exports.handler = async (event) => {
  // モジュールの読み込み
  const sharp = require("sharp");

  // Base64からBufferに変換
  const imageBase64 = event.image;
  const imageBuffer = Buffer.from(imageBase64, "base64");

  // ===========================
  //         変換処理
  // ===========================
  let outputImage = imageBuffer;
  let err = false;
  // リサイズ処理
  if (event.resize) {
    console.log("リサイズ処理");
    await sharp(outputImage)
      .resize(event.width, event.height, {
        fit: event.fit,
        position: event.position,
        background: event.background,
      })
      .toBuffer()
      .then((res) => {
        outputImage = res;
      })
      .catch((error) => {
        console.log(error);
        err = true;
      });
  }

  // フォーマット変換
  if (!(event.original && !event.optimization)) {
    // 最適化
    if (event.optimization) {
      if (event.type === "jpeg") {
        console.log("JPEGを最適化");
        await sharp(outputImage)
          .jpeg({ quality: 80 })
          .toBuffer()
          .then((res) => {
            outputImage = res;
          })
          .catch((error) => {
            console.log(error);
            err = true;
          });
      }
    }
    // JPEG変換
    else if (event.format === "jpeg") {
      console.log("JPEG変換");
      await sharp(outputImage)
        .jpeg({ quality: event.level })
        .toBuffer()
        .then((res) => {
          outputImage = res;
        })
        .catch((error) => {
          console.log(error);
          err = true;
        });
    }

    // PNG変換
    else if (event.format === "png" && event.type !== "png") {
      console.log("PNG変換");
      await sharp(outputImage)
        .png({ progressive: true })
        .toBuffer()
        .then((res) => {
          outputImage = res;
        })
        .catch((error) => {
          console.log(error);
          err = true;
        });
    }

    // WebP変換
    else if (event.format === "webp") {
      console.log("WebP変換");
      if (event.lossless) {
        await sharp(outputImage)
          .webp({ lossless: true })
          .toBuffer()
          .then((res) => {
            outputImage = res;
          })
          .catch((error) => {
            console.log(error);
            err = true;
          });
      } else {
        await sharp(outputImage)
          .webp({ quality: event.level })
          .toBuffer()
          .then((res) => {
            outputImage = res;
          })
          .catch((error) => {
            console.log(error);
            err = true;
          });
      }
    }

    // GIF変換
    else if (event.format === "gif" && event.type !== "gif") {
      console.log("GIF変換");
      await sharp(outputImage)
        .gif()
        .toBuffer()
        .then((res) => {
          outputImage = res;
        })
        .catch((error) => {
          console.log(error);
          err = true;
        });
    }

    // TIFF変換
    /* else if(event.format === 'tiff') {
        console.log('TIFF変換')
        await sharp(outputImage)
            .tiff( { quality : event.level } )
            .toBuffer()
            .then( res => {
                outputImage = res;
            })
            .catch(error => {
              err = true;
            });
    } */

    // AVIF変換
    else if (event.format === "avif") {
      console.log("AVIF変換");
      if (event.lossless) {
        await sharp(outputImage)
          .avif({ lossless: true })
          .toBuffer()
          .then((res) => {
            outputImage = res;
          })
          .catch((error) => {
            console.log(error);
            err = true;
          });
      } else {
        await sharp(outputImage)
          .avif({ quality: event.level })
          // .avif()
          .toBuffer()
          .then((res) => {
            outputImage = res;
          })
          .catch((error) => {
            console.log(error);
            err = true;
          });
      }
    }

    // HEIF変換
    /* else if (event.format === "heif") {
      console.log("HEIF変換");
      if (event.lossless) {
        await sharp(outputImage)
          .heif({ lossless: true })
          .toBuffer()
          .then((res) => {
            outputImage = res;
          })
          .catch((error) => {
            err = true;
          });
      } else {
        await sharp(outputImage)
          .heif({ quality: event.level })
          .toBuffer()
          .then((res) => {
            outputImage = res;
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
      errorMessage: "Error in conversion process",
    };
    return response;
  } else {
    // BufferからBase64に変換
    const responseImage = Buffer.from(outputImage).toString("base64");

    // レスポンス
    const response = {
      statusCode: 200,
      body: JSON.stringify({ image: responseImage }),
    };
    return response;
  }
};
