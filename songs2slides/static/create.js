addEventListener('submit', () => {
    if (document.getElementById('step-1')) {
        // Show step 1 spinner
        document.getElementById('post-submit').hidden = false
    } else if (document.querySelector('input[value=pptx]').checked) {
        // Show step 2 downloading message and hide step 2 form
        document.getElementById('post-submit').hidden = false
        document.getElementById('step-2').hidden = true
    }
})

addEventListener('pageshow', () => {
    // Correct page state after returning via browser back button
    document.getElementById('post-submit').hidden = true
    document.getElementsByTagName('form')[0].hidden = false
})

/* step 1 functions */
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
    for (let i = 1; i < songs.length; i++) {
        songs[i].children[0].textContent = `${i}.`
        songs[i].children[1].children[0].name = `title-${i}`
        songs[i].children[2].children[0].name = `artist-${i}`
        songs[i].children[3].children[0].onclick = () => remove_song(i)
    }
}
