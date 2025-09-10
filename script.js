let notes = ['Apfel und Banane'];
let notesTitles = ['Früchte'];
let trash = [];
let trashTitles = [];

function renderNotes() {
    let notesRender = "<ul>";
    let renderContent = document.getElementById('content_note');
    for (let numberNotes = 0; numberNotes < notes.length; numberNotes++) {
        const title = notesTitles[numberNotes];
        const note = notes[numberNotes];
        notesRender += getNoteTemplate(title, note);
    }
    notesRender += "</ul>";
    renderContent.innerHTML = notesRender;

}
function getNoteTemplate(title, note) {
    return `
    <li class="note_render">
    <label>
    <input type="checkbox">
     <strong>
     ${title}
     </strong>
    </label>
    <br>
    <div class="note_body">
    <p>${note}</p>
    </div>
    </li>
    `;
}

function renderTrash() {
    let noteTrash = "<ul>";
    for (let numberTrash = 0; numberTrash < trash.length; numberTrash++) {
        noteTrash += getNoteTemplate(trashTitles[numberTrash], trash[numberTrash]);
    }
    noteTrash += "</ul>";
    document.getElementById('trash_list').innerHTML = noteTrash;
}

function saveNotes() {
    const LEN = Math.min(notesTitles.length, notes.length);
    for (let i = 0; i < LEN; i++) {
        const TITLE = notesTitles[i]?.trim();
        if (!TITLE) continue; /*guard*/
        const TEXT = String(notes[i] ?? '');
        const BASE = `nb:${TITLE}`;
        let key = BASE;
        let n = 1;
        while (localStorage.getItem(key) !== null) {
            n++;
            key = `${BASE}#${n}`;
        }
        localStorage.setItem(key, TEXT);
    }
    notes = [];
    notesTitles = [];
    renderNotes(0);
}

function loadNotes() {
    let allKeys = Object.keys(localStorage);
    for (let i = 0; i < allKeys.length; i++) {
        const KEY = allKeys[i];
        if (!KEY.startsWith('nb:')) continue;

        const AFTERPREFIX = KEY.slice('nb:'.length); // um die Länge von 'nb:' = (3)
        const TITLE = AFTERPREFIX.split('#')[0]; //     alles hinter '#' weg
        const TEXT = localStorage.getItem(KEY) ?? '';// wenn kein String, dann leer ('')

        notes.push(TEXT);
        notesTitles.push(String(TITLE));
    }
    clearLocalStorage();
    renderNotes();
}

function clearLocalStorage() {
    const keys = Object.keys(localStorage);
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (k.startsWith('nb:')) localStorage.removeItem(k);
    }
}

function askForCtrlEnter(e) {
    if (!(e.ctrlKey && e.key === 'Enter')) return
    const title = document.getElementById('add_title');
    const note = document.getElementById('add_notes');
    if (title.value.trim() === '' || note.value.trim() === '') return;
    // oder if (!title.value.trim() || !note.value.trim()) return;
    e.preventDefault();
    document.querySelector('#add_form button[type="submit"]').click();
 
}

function handleAddSubmit(event) {
    event.preventDefault();
    addNote();
}

function addNote() {
    const INPUTTITLE = document.getElementById('add_title');
    const INPUT = document.getElementById('add_notes');
    notesTitles.push(INPUTTITLE.value);
    notes.push(INPUT.value);
    renderNotes();
    INPUT.value = '';
    INPUTTITLE.value = '';
}

function checkEnter(event) {
    if (event.key === 'Enter') addNote();
}


function deleteNotes() {
    const CONTENTNOTELIST = document.querySelectorAll('#content_note input[type="checkbox"]');
    for (let checkboxIndex = CONTENTNOTELIST.length - 1; checkboxIndex >= 0; checkboxIndex--) {
        if (CONTENTNOTELIST[checkboxIndex].checked) {
            const [moveToTrashTitle] = notesTitles.splice(checkboxIndex, 1);
            const [moveToTrash] = notes.splice(checkboxIndex, 1);
            trashTitles.push(moveToTrashTitle);
            trash.push(moveToTrash);
        }
    }
    renderNotes();
    renderTrash();
}

function undelete() {
    const CONTENTNOTELIST = document.querySelectorAll('#trash_list input[type="checkbox"]');
    for (let checkboxIndex = CONTENTNOTELIST.length - 1; checkboxIndex >= 0; checkboxIndex--) {
        if (CONTENTNOTELIST[checkboxIndex].checked) {
            const [restoreFromTrashTitle] = trashTitles.splice(checkboxIndex, 1);
            const [restoreFromTrash] = trash.splice(checkboxIndex, 1);
            notesTitles.push(restoreFromTrashTitle);
            notes.push(restoreFromTrash);
        }
    }
    renderTrash();
    renderNotes();
}

function toggleTrash() {
    const dlg = document.querySelector('#trash');
    if (!dlg) return;
    dlg.open ? dlg.close() : dlg.showModal();
}

function emptyTrash() {
    trash.length = 0;
    trashTitles.length = 0;
    renderTrash();
}

function toggleAddUI() {
    const panel = document.querySelector('.note');
    if (!panel) return;

    panel.classList.toggle('hidden');

    if (!panel.classList.contains('hidden')) {
        requestAnimationFrame(function () {
            const inp = panel.querySelector('#add_notes');
            if (inp) { inp.focus(); inp.select(); }
        });
    }
}

