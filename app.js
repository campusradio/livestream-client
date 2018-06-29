Amplitude.init({
	volume: 100,
	"songs": [{
		"url": "https://live.campusradiodresden.de/stream",
		live: true
	}]
})

window.onkeydown = function (e) {
	player.toggle()
}

class Player {
	constructor() {
		this.toggleElm = document.querySelector('.toggle').classList
		this.playing = false
		this.available = false
	}

	static async checkIfStreamIsOnline() {
		const stream = await fetch('https://live.campusradiodresden.de/stream')
		return stream.status === 200
	}

	static setText(msg) {
		document.querySelector('.status').innerHTML = msg
	}

	play(online) {
		if (online) {
			if (this.available) return
			this.available = true
			this.toggleElm.remove('error')
			if (!this.playing) return
		} else if (this.playing || !this.available) return

		this.playing = true
		Amplitude.play()
		Player.setText('Live')
		this.toggleElm.remove('play')
		this.toggleElm.add('pause')
	}

	pause(offline) {
		if (offline) {
			this.available = false
			this.toggleElm.add('error')
		}
		if (!this.playing) return

		if (!offline) {
			this.playing = false
			Player.setText('Paused')
		} else Player.setText('Offline')
		Amplitude.pause()
		this.toggleElm.remove('pause')
		this.toggleElm.add('play')
	}

	toggle() {
		if (!this.available) return
		if (this.playing) this.pause()
		else this.play()
	}
}

document.addEventListener('DOMContentLoaded', () => {
	window.player = new Player()
	const logo = document.querySelector('.logo-wrapper')

	async function check() {
		if (await Player.checkIfStreamIsOnline()) player.play(true)
		else player.pause(true)
	}

	function resize() {
		logo.style.height = `${logo.offsetWidth}px`
	}

	document.querySelector('.toggle').addEventListener('click', () => player.toggle())
	document.querySelector('.toggle').addEventListener('touchStart', () => player.toggle())
	window.addEventListener('resize', resize)

	setInterval(check, 3000)
	check()
	resize()
})