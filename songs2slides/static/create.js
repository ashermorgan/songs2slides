// Global Songs2Slides localStorage prefix
const PREFIX = 's2s'

// Page load/reload handler
addEventListener('pageshow', () => {
    // Correct page state after returning via browser back button
    document.getElementById('post-submit').hidden = true

    if (STEP === 1) {
        // Load songs
        for (let row of document.querySelectorAll('tbody tr')) {
            row.remove()
        }
        const songs = storage_get('songs', [{ title: '', artist: '' }])
        for (let song of songs) {
            add_song()
            const raw_song = document.querySelector('tbody tr:last-child')
            raw_song.children[1].children[0].value = song.title
            raw_song.children[2].children[0].value = song.artist
        }
    } else if (STEP === 3) {
        // Load settings
        const form = document.getElementById('create-form')
        form['title-slides'].checked = storage_get('title-slides', true)
        form['blank-slides'].checked = storage_get('blank-slides', true)
        form['output-type'].value = storage_get('output-type', 'html')
    }
})

// Form submit handler
addEventListener('submit', () => {
    // Show loading spinner
    document.getElementById('post-submit').hidden = false

    if (STEP === 3) {
        // Save settings
        const form = document.getElementById('create-form')
        storage_set('title-slides', form['title-slides'].checked)
        storage_set('blank-slides', form['blank-slides'].checked)
        storage_set('output-type', form['output-type'].value)

        // Redirect to post download message
        if (form['output-type'].value === 'pptx') {
            setTimeout(() => {
                // On Chrome, redirecting after a form submission doesn't work
                // unless setTimeout is used
                // (REDIRECT_URL set in create-step-3.html template)
                window.location.href = REDIRECT_URL
            }, 300)
        }
    }
})

// Step 1 functions
function add_song() {
    let row = document.getElementById('row-template').content.children[0].cloneNode(true)
    document.getElementById('songs').appendChild(row)
    renumber_songs()
}

function remove_song(n) {
    document.getElementsByTagName('tr')[n].remove()
    renumber_songs()
    if (document.getElementsByTagName('tr').length === 1) add_song()
}

function renumber_songs() {
    const songs = document.getElementsByTagName('tr')
    for (let i = 1; i < songs.length - 1; i++) {
        songs[i].children[0].textContent = `${i}.`
        songs[i].children[1].children[0].name = `title-${i}`
        songs[i].children[2].children[0].name = `artist-${i}`
        songs[i].children[3].children[0].onclick = () => remove_song(i)
    }
}

function save_songs() {
    const raw_songs = document.getElementsByTagName('tr')
    let songs = []
    for (let i = 1; i < raw_songs.length - 1; i++) {
        songs.push({
            title: raw_songs[i].children[1].children[0].value,
            artist: raw_songs[i].children[2].children[0].value,
        })
    }
    storage_set('songs', songs)
}

// Step 3 helper functions
function storage_get(key, default_value) {
    try {
        value = JSON.parse(localStorage.getItem(`${PREFIX}.${key}`))
    } catch {
        return clonedDefault
    }
    return value === null ? default_value : value
}

function storage_set(key, value) {
    localStorage.setItem(`${PREFIX}.${key}`, JSON.stringify(value))
}
