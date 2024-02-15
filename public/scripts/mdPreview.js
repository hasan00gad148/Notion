const content = document.getElementById('content');
const mdContent = document.getElementById('previewContent');
const previewBTN = document.getElementById('preview-btn');

console.log(mdContent,content,previewBTN);


previewBTN.addEventListener('click',function(e) {
    if(previewBTN.textContent === "preview") {
        mdContent.mdContent  = content.value;
        content.style.display = 'none';
        mdContent.style.display = 'inline-block';
        previewBTN.textContent = "edit";
    }else{
        content.style.display = 'inline-block';
        mdContent.style.display = 'none';
        previewBTN.textContent = "preview";
    }
    
});

const insertTabCharacter = () => {
    const { value, selectionStart, selectionEnd } = content;

    // Insert tab character
    content.value = `${value.substring(0, selectionEnd)}\t${value.substring(selectionEnd)}`;

    // Move cursor to new position
    content.selectionStart = content.selectionEnd = selectionEnd + 1;
};
content.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        insertTabCharacter();
    }
});































