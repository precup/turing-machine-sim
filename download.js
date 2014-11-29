function downloadAsJson(object, filename) {
  var a = window.document.createElement('a');
  a.href = window.URL.createObjectURL(new Blob([JSON.stringify(object)], {type: 'text/json'}));
  a.download = filename;

  document.body.appendChild(a)
  a.click();
  document.body.removeChild(a)
}

function downloadAsPng(svg) {
  var canvas = svgToCanvas(svg);
  
  var a = window.document.createElement('a');
  a.href = canvas.toDataURL("image/png");
  a.download = "tm.png";
  
  document.body.appendChild(a)
  a.click();
  document.body.removeChild(a)
  
  document.body.removeChild(canvas);
}

function svgToCanvas(svg){
    var img = new Image(),
        serializer = new XMLSerializer(),
        svgStr = serializer.serializeToString(svg[0][0]);

    img.src = 'data:image/svg+xml;base64,'+window.btoa(svgStr);

    var canvas = window.document.createElement("canvas");
    document.body.appendChild(canvas);

    canvas.width = svg.attr("width");
    canvas.height = svg.attr("height");
    canvas.getContext("2d").drawImage(
      img,
      0, 0,
      svg.attr("width"), svg.attr("height")
    );
    return canvas;
};
