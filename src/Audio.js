import Vue from 'vue'

class MyAudio {
    constructor(songList, startIndex) {
        this.$songList = songList
        this.$data = Vue.observable({
            volume: 0,
            currentIndex: startIndex,
            currentSong: songList[startIndex],
            paused: true,
            progress: 0
        })

        this.$audio = this.createAudio()
        this.setPlayIndex(startIndex)
    }

    // 创建Audio实例
    createAudio() {
        const audio = new Audio()
        audio.addEventListener('volumechange', () => {
            this.$data.volume = audio.volume
        })
        audio.addEventListener('timeupdate', () => {
            this.$data.progress = 100 * audio.currentTime / audio.duration
        })
        audio.addEventListener('play', () => (this.$data.paused = false))
        audio.addEventListener('pause', () => (this.$data.paused = true))
        audio.addEventListener('ended', () => (this.$data.paused = true))

        this.$data.volume = audio.volume
        return audio
    }

    // 切换音量等级
    toggleVolume() {
        const currentVolume = this.$data.volume
        if (currentVolume === 0) {
            this.$audio.volume = 0.3
        } else if (currentVolume >= 0.8) {
            this.$audio.volume = 0
        } else {
            this.$audio.volume = 0.8
        }
    }

    // 切换暂停和播放
    togglePlay() {
        if (!this.$data.currentSong) return
        if (this.$audio.paused) {
            this.$audio.play()
        } else {
            this.$audio.pause()
        }
    }

    // 切到下一首
    toggleNext() {
        const index = this.$data.currentIndex + 1
        this.setPlayIndex(index >= this.$songList.length ? 0 : index, true)
    }

    // 切到上一首
    togglePrev() {
        const index = this.$data.currentIndex - 1
        this.setPlayIndex(index <= 0 ? this.$songList.length - 1 : index, true)
    }

    // 设置播放队列里的哪首歌
    setPlayIndex(index, autoplay) {
        const song = this.$songList[index]
        if (song) {
            this.$audio.src = song.audio
            this.$data.currentIndex = index
            this.$data.currentSong = song
            this.$data.progress = 0
            this.$data.paused = true
            if (autoplay) {
                this.$audio.play()
            }
        }
    }

    setProgress(progress) {
        this.$data.progress = progress
        this.$audio.currentTime = this.$audio.duration * progress / 100
    }
}

export default MyAudio
