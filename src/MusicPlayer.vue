<template>
    <div class="player" :class="{ turnover: isTurnOvered }">
        <!-- 正面播放器 -->
        <section>
            <!-- 磁盘占位 -->
            <div class="player-disc"></div>
            <!-- 歌曲封面 -->
            <div class="player-picture">
                <img :src="currentMusic.picture" v-if="currentMusic" draggable="false">
            </div>
            <!-- 播放进度 -->
            <Progress class="player-progress" v-model="musicProgressWidth" />

            <section class="player-aside">
                <!-- 歌名与歌手 -->
                <section class="player-info">
                    <h1 class="title">{{ currentMusic.title }}</h1>
                    <strong class="singer">{{ currentMusic.singer }}</strong>
                </section>
                <!-- 按钮 -->
                <section class="player-btn-group">
                    <span class="player-btn" :class="playBtnIcon" @click="handlerPlayBtnClick"></span>
                    <span class="player-btn mp-icon-prev" @click="handlerPrevBtnClick"></span>
                    <span class="player-btn mp-icon-next" @click="handlerNextBtnClick"></span>
                </section>
                <!-- 音量控制条 -->
                <div class="player-volume">
                    <span :class="volumeIcon" @click="toggleVolume"></span>
                    <Progress class="player-volume-progress" v-model="volumeProgressWidth" realtime />
                </div>
            </section>

            <!-- 歌单列表图标 -->
            <span class="player-menu mp-icon-list" @click="isTurnOvered = true"></span>
        </section>

        <!-- 反面歌曲列表 -->
        <section class="player-list">
            <!-- 标题栏 -->
            <section class="player-header">
                <span class="back mp-icon-back" @click="isTurnOvered = false"></span>
                <span class="title">歌单</span>
            </section>
            <!-- 列表区域 -->
            <section class="player-list-content">
                <section class="player-songlist">
                    <aside
                        class="player-song"
                        :key="k"
                        :class="{ active: currentMusic === v }"
                        v-for="(v,k) in list"
                        @click="handlerSongClick(v, k)"
                    >
                        <strong class="title">{{v.singer}} - {{v.title}}</strong>
                        <span :class="`mp-icon-${currentPlayingIndex === k ? 'pause' : 'play'}`"></span>
                    </aside>
                </section>
            </section>
        </section>
    </div>
</template>

<script>
import MyAudio from './Audio'
import Progress from './Progress'

export default {
    components: {
        Progress
    },
    props: {
        list: {
            type: Array,
            default: () => []
        },
        current: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            // 是否翻面
            isTurnOvered: false
        }
    },
    created() {
        this.audio = new MyAudio(this.list, this.current)
    },
    computed: {
        // 当前播放的歌曲
        currentMusic() {
            if (!this.audio) return {}
            return this.audio.$data.currentSong
        },

        // 播放进度条显示宽度
        musicProgressWidth: {
            get() {
                if (!this.audio) return 0
                return this.audio.$data.progress
            },
            set(value) {
                this.audio.setProgress(value)
            }
        },

        // 音量图标
        volumeIcon() {
            if (!this.audio) return 'mp-icon-volume-up'
            const { volume } = this.audio.$data
            if (volume >= 0.8) return 'mp-icon-volume-up'
            if (volume === 0) return 'mp-icon-volume-off'
            return 'mp-icon-volume-down'
        },

        // 音量进度条显示宽度
        volumeProgressWidth: {
            get() {
                return this.audio.$data.volume * 100
            },
            set(value) {
                this.audio.$audio.volume = value / 100
            }
        },

        // 播放按钮图标
        playBtnIcon() {
            if (!this.audio) return 'mp-icon-play'
            return this.audio.$data.paused ? 'mp-icon-play' : 'mp-icon-pause'
        },

        // 当前处于播放状态的歌曲索引
        currentPlayingIndex() {
            if (!this.audio) return -1
            if (this.audio.$data.paused) return -1
            return this.audio.$data.currentIndex
        }
    },
    methods: {

        // 切换音量
        toggleVolume() {
            this.audio.toggleVolume()
        },

        // 监听播放按钮点击事件
        handlerPlayBtnClick() {
            this.audio.togglePlay()
        },

        // 监听上一首按钮点击事件
        handlerPrevBtnClick() {
            this.audio.togglePrev()
        },

        // 监听下一首按钮点击事件
        handlerNextBtnClick() {
            this.audio.toggleNext()
        },

        // 监听歌曲点击事件
        handlerSongClick(song, index) {
            if (this.currentMusic !== song) {
                this.audio.setPlayIndex(index, true)
            } else {
                this.audio.togglePlay()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./icons/iconfont.css";

$color-primary: #a21515;
$color-primary-dark: darken($color-primary, 10%);

.player {

    --width: 320px;
    --height: calc(var(--width) * 0.4375);

    --bg-color: #434343;
    --bg-color-light: #575757;
    --bg-color-dark: #181818;

    --border-color: #111111;
    --border-color-dark: #080808;
    --border-color-light: #868686;

    --text-color: #FFF;

    --color-primary: #{$color-primary};
    --color-primary-dark: #{$color-primary-dark};

    --spacing-base: calc(var(--width) * 0.0625);
    --spacing-small: calc(var(--spacing-base) / 2);

    --radius-base: calc(var(--width) * 0.01875);
    --radius-small: calc(var(--radius-base) / 2);

    --icon-size-base: calc(var(--width) * 0.05625);
    --icon-size-large: calc(var(--icon-size-base) * 2);

    --font-size-title: calc(var(--width) * 0.05);
    --font-size-subtitle: calc(var(--font-size-title) * 0.8);
    --font-size-base: calc(var(--width) * 0.04375);
    --font-size-small: calc(var(--font-size-base) * 0.85714);

    width: var(--width);
    height: var(--height);
    background-color: var(--bg-color);
    padding: var(--spacing-base);
    border-radius: var(--radius-base);
    border: 1px solid var(--border-color);
    position: relative;
    transform-style: preserve-3d;
    transition: all .3s;
    user-select: none;

    // 播放器正面
    > section {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: var(--bg-color);
        backface-visibility: hidden;
        border-radius: var(--radius-base);
    }

    // 磁盘占位
    &-disc {
        --disc-width: calc(var(--width) / 4);

        top: 14%;
        left: 20%;
        width: var(--disc-width);
        height: var(--disc-width);
        background-image: url("./imgs/disc.gif");
        background-size: cover;
        position: absolute;
    }

    // 歌曲封面
    &-picture {
        --pic-size: calc(var(--width) * 0.3);

        top: var(--spacing-base);
        left: var(--spacing-base);
        width: var(--pic-size);
        height: var(--pic-size);
        position: absolute;

        > img {
            width: 100%;
            height: 100%;
            border-radius: var(--radius-base);
            user-select: none;
        }
    }

    // 播放进度条
    &-progress {
        left: var(--spacing-base);
        bottom: var(--spacing-base);
        width: calc(100% - 2 * var(--spacing-base));
        position: absolute;
    }

    &-aside {
        top: calc(var(--spacing-base) + 5px);
        right: var(--spacing-base);
        position: absolute;
        width: 48%;
    }

    // 音量控制条
    &-volume {
        --h: calc(var(--height) * 0.1);
        height: var(--h);
        display: flex;
        align-items: center;
        position: relative;

        &-progress {
            --w: calc(var(--width) * 0.48);
            width: var(--w);
            height: 100%;
        }

        > [class*="mp-icon-"] {
            color: var(--text-color);
            cursor: pointer;
            font-size: var(--icon-size-base);
        }
    }

    // 按钮
    &-btn {
        --h: calc(var(--height) * 0.14);
        flex: 1;
        height: 100%;
        color: var(--text-color);
        text-align: center;
        background-color: var(--bg-color-light);
        border-top: 1px solid var(--border-color-light);
        border-left: 1px solid var(--border-color-light);
        cursor: pointer;

        &-group {
            width: 100%;
            height: var(--h);
            margin-bottom: var(--spacing-small);
            background-color: var(--bg-color-dark);
            border-radius: var(--radius-small);
            overflow: hidden;
            display: flex;
            border: 1px solid var(--bg-color-dark);
        }

        &:not(:first-child) {
            margin-left: 1px;
        }

        &:active {
            border: none;
            border-right: 1px solid var(--border-color-light);
            border-bottom: 1px solid var(--border-color-light);
        }
    }

    // 歌曲信息
    &-info {
        margin-bottom: var(--spacing-small);

        > h1, strong {
            margin: 0;
            color: var(--text-color);
            max-width: 80%;
        }

        > .title {
            font-size: var(--font-size-title);
            font-weight: 700;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        > .singer {
            font-size: var(--font-size-subtitle);
            font-weight: normal;
        }
    }

    // 歌单列表按钮
    &-menu {
        top: var(--spacing-base);
        right: var(--spacing-base);
        color: var(--text-color);
        font-size: var(--icon-size-large);
        position: absolute;
        cursor: pointer;
    }

    // 翻至背面
    &.turnover {
        transform: rotateY(180deg);
    }

    // 歌单列表板块
    > section.player-list {
        transform: rotateY(180deg);
        display: flex;
        flex-direction: column;
    }

    &-list-content {
        overflow: auto;
    }

    &-header {
        --h: calc(var(--width) * 0.09375);

        height: var(--h);
        text-align: center;
        line-height: var(--h);
        color: var(--text-color);
        border-bottom: 1px solid var(--border-color-light);
        margin: 0 var(--spacing-small);

        > .title {
            font-size: var(--font-size-base);
        }

        > .back {
            top: 0;
            left: 0;
            width: var(--h);
            height: var(--h);
            line-height: var(--h);
            text-align: center;
            position: absolute;
            font-size: var(--icon-size-base);
            cursor: pointer;
        }
    }

    // 歌单列表区域
    &-songlist {
        flex: 1;
        padding: var(--spacing-small);
        position: relative;
        display: flex;
        flex-wrap: wrap;
    }

    &-song {
        --h: calc(var(--width) * 0.09375);

        width: calc(50% - 10px);
        color: var(--text-color);
        font-size: var(--font-size-small);
        display: flex;
        align-items: center;
        justify-content: space-between;
        opacity: .6;
        cursor: pointer;
        height: var(--h);
        margin: 0 5px;

        &.active {
            opacity: 1;
        }

        > strong {
            flex: 1;
            width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>
