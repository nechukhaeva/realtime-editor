var socket;
var text = {
    text: ''
};
var offset = 0;

function setup(){
    $('textarea').trumbowyg({
        lang: 'ru'
    })
    socket = io.connect('http://localhost:8080');

    document.querySelector(".trumbowyg-editor").addEventListener('input', function(){
        var html = $(this).html();
        var data = {
            text: html
        };
        //console.log(data)
        socket.emit('text', data);
    });
    socket.on('text', handleRecievedText);
    socket.on('newUser', updateText);
}

function updateText(data){
    let editor = document.querySelector(".trumbowyg-editor")
    offset = getCursorPosition(editor)
    console.log("updateText offset", offset)

    text.text = data.text;
    $(".trumbowyg-editor").html(data.text)
    console.log("updateText", data)

    setCursorPosition(editor, offset)
    console.log("updateText 2", getCursorPosition(editor))
    /*var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(editor.childNodes[editor.childNodes.length - 1], 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);*/
}

function handleRecievedText(data){
    let editor = document.querySelector(".trumbowyg-editor")
    offset = getCursorPosition(editor)
    console.log("handleRecievedText offset", offset)

    text.text = data.text;
    $(".trumbowyg-editor").html(data.text);
    console.log("handleRecievedText", data);

    setCursorPosition(editor, offset)
    console.log("handleRecievedText 2", getCursorPosition(editor))
    
    /*var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(editor.childNodes[editor.childNodes.length - 1], 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);*/
}

function getCursorPosition(parent) {
    let selection = document.getSelection()
    let range = new Range
    range.setStart(parent, 0)
    if (selection.anchorNode) range.setEnd(selection.anchorNode, selection.anchorOffset)
    return range.toString().length
}

function setCursorPosition(parent, position) {
    let child = parent.firstChild
    while(position > 0) {
        let length = child.textContent.length
        if(position > length) {
        position -= length
        child = child.nextSibling
        }
        else {
        if(child.nodeType == 3) return document.getSelection().collapse(child, position)
        child = child.firstChild
        }
    }
}
