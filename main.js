fetch("./asset/icon.png").then((response) => {
  console.log(response); // body是一个单独的Body对象使用一个geter实现了ReadableStream
  const reader = response.body.getReader(); //拿到一个reader
  // 实现一个可读流
  const stream = new ReadableStream({
    start(controller) {
      // 下面的函数处理每个数据块
      var i = 0;
      var data = [];
      function push() {
        // "done"是一个布尔型，"value"是一个Uint8Array
        reader.read().then(({ done, value }) => {
          // 判断是否还有可读的数据？
          if (done) {
            // 告诉浏览器已经结束数据发送
            console.log(i);
            controller.close();
            document.querySelector("#btn").addEventListener("click", () => {
              saveFile(data[0]);
            });
            document.querySelector("#btn-1").addEventListener("click", () => {
              writeLog();
            });
            return;
          }
          console.log(value);
          // 取得数据并将它通过controller发送给浏览器
          controller.enqueue(value);
          data.push(value);
          i++;
          push();
        });
      }

      push();
    },
    autoAllocateChunkSize: 50 //读取stream的时候，chunk大小
  });
  // 实现一个响应流
  return new Response(stream, { headers: { "Content-Type": "text/html" } });
});

// fileWritableStream
async function saveFile(imgBlob) {
  // 获取一个文件 - FileSystemFileHandle
  const newHandle = (await window.showSaveFilePicker())[0];
  console.log(newHandle);
  // 获取该文件的可写流
  const writableStream = await newHandle.createWritable();

  // write our file
  await writableStream.write(imgBlob);

  // close the file and write the contents to disk.
  await writableStream.close();
}

function writeLog() {
  var file = new File(["foo"], "foo.txt", {
    type: "text/plain"
  });
  async function saveFile() {
    //showSaveFilePicker 选中或创建可存储的文件 如：目录
    //可以存储 bold文件 file文件会当bold文件处理 所以没有文件名
    const newHandle = await window.showSaveFilePicker();

    // create a FileSystemWritableFileStream to write to
    const writableStream = await newHandle.createWritable();

    // write our file
    await writableStream.write(file);

    // close the file and write the contents to disk.
    await writableStream.close();
  }
  saveFile();
}
// window.showDirectoryPicker() 是file Handerl的容器
