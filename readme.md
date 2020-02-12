# MusicPlayer

基于 Vue 的一款简单易用、可插拔的音乐播放器组件。

## Installation

```
npm install @leexiaohui/music-player
```

## Usage

**ES6**

```vue
<template>
    <div id="app">
        <MusicPlayer :list="songList" />
    </div>
</template>

<script>
import MusicPlayer from '@leexiaohui/music-player'

export default {
    components: {
        MusicPlayer
    },

    data() {
        return {
            songList: [{
                title: '',
                singer: '',
                picture: '',
                audio: ''
            }]
        }
    }
}
</script>
```

**Browser**

```html
<script src="path/to/vue/vue.min.js"></script>
<script src="path/to/@leexiaohui/music-player/dist/MusicPlayer.umd.min.js"></script>
<script>
    new Vue({
        components: {
            MusicPlayer
        }
    })
</script>
```

## Props

|Name|Required|Default|Type|Description|
|:-|:-|:-|:-|:-|
|list|Y|-|Array|歌曲列表|

**list options**

|Name|Type|Description|
|:-|:-|:-|
|title|String|歌曲名称|
|singer|String|歌手名|
|picture|String|封面路径|
|audio|String|音源路径|
