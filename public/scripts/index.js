let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;


if (window.location.pathname === '/notes') {
  noteTitle = document.getElementById('task-title');
  noteText = document.getElementById('task-description');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.getElementById('task-list-container list-group');
}

let activeNote = {};

const show = (elem) => {
    elem.style.display = 'inline';
  };
  
  const hide = (elem) => {
    elem.style.display = 'none';
  };
  
  const getNotes = () =>
    fetch('/api/notes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
  const saveNote = (note) =>
    fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
  
  const deleteNote = (id) =>
    fetch(`/api/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
  const renderActiveNote = () => {
    hide(saveNoteBtn);
  
    if (activeNote.id) {
      noteTitle.setAttribute('readonly', true);
      noteText.setAttribute('readonly', true);
      noteTitle.value = activeNote.title;
      noteText.value = activeNote.text;
    } else {
      noteTitle.removeAttribute('readonly');
      noteText.removeAttribute('readonly');
      noteTitle.value = '';
      noteText.value = '';
    }
  };
  
  const handleNoteSave = () => {
    const newNote = {
      title: noteTitle.value,
      text: noteText.value,
    };
    console.log(newNote);
    saveNote(newNote).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  };
  
  const handleNoteDelete = (e) => {

    e.stopPropagation();
  
    const note = e.target;
    const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;
  
    if (activeNote.id === noteId) {
      activeNote = {};
    }
  
    deleteNote(noteId).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  };
 
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};


const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

const renderNoteList = async (notes) => {
  // getNotes().then((data) => {console.log(data)}); 
  // let jsonNotes = JSON.parse(fs.readFileSync('../../db/db.json'));
  // console.log(jsonNotes);
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');

    const spanEl = document.createElement('div');
    spanEl.setAttribute('id', 'created-task');

    liEl.append(spanEl);

    const taskInfo = document.createElement('h1');
    taskInfo.innerText = text;
    taskInfo.addEventListener('click', handleNewNoteView);

    spanEl.append(taskInfo);

    if (delBtn) {
        const delBtnEl = document.createElement('i');
        delBtnEl.classList.add(
          'fa-solid',
          'fa-trash',
        );
        delBtnEl.addEventListener('click', handleNoteDelete);
  
        spanEl.append(delBtnEl);
      }
  
      return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();
