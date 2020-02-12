<template>
    <div class="progress" @mousedown="handlerMouseDown">
        <div :style="`width: ${progress}%`"></div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Number,
            default: 0
        },

        // 是否在拖动时改变 value 的值
        realtime: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // 是否正处于拖动状态
            isDragging: false,
            // 预览进度条的宽度
            preProgressWidth: 0
        }
    },
    computed: {
        progress() {
            if (this.isDragging) return this.preProgressWidth
            return Math.min(100, Math.max(0, this.value))
        }
    },
    methods: {
        // 监听鼠标按下进度条事件
        handlerMouseDown(e) {
            this.isDragging = true
            this.setPrePogress(e.offsetX)

            const handlerMouseMove = e => {
                this.setPrePogress(e.offsetX - this.$el.offsetLeft)
            }
            const handlerMouseUp = () => {
                this.isDragging = false
                this.$emit('input', this.preProgressWidth)
                document.removeEventListener('mousemove', handlerMouseMove)
                document.removeEventListener('mouseup', handlerMouseUp)
            }

            // 监听鼠标移动事件
            document.addEventListener('mousemove', handlerMouseMove)
            // 监听鼠标松开事件
            document.addEventListener('mouseup', handlerMouseUp)
        },

        // 计算预览进度条的宽度
        setPrePogress(offsetX) {
            this.preProgressWidth = Math.max(
                Math.min(100, 100 * offsetX / this.$el.offsetWidth), 0
            )
            if (this.realtime) {
                this.$emit('input', this.preProgressWidth)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.progress {
    --pro-height: calc(var(--height) * 0.1);

    width: 100%;
    height: var(--pro-height);
    background-color: var(--bg-color-dark);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-small);
    overflow: hidden;
    position: relative;
    cursor: pointer;

    > div {
        --size: calc(var(--width) * 0.025);
        height: 100%;
        background-image: linear-gradient(
            135deg,
            var(--color-primary) 0, var(--color-primary) 35%,
            var(--color-primary-dark) 35%, var(--color-primary-dark) 50%,
            var(--color-primary) 50%, var(--color-primary) 85%,
            var(--color-primary-dark) 85%, var(--color-primary-dark)
        );
        background-size: var(--size) var(--size);
    }
}
</style>
