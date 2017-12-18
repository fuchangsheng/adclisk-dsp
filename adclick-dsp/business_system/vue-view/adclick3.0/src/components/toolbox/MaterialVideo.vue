<template>
    <div>
        <toolbar></toolbar>
    </div>
</template>
<script>
import ToolBar from './MaterialVideo/ToolBar';
export default {
    name: 'material_video',
    data(){
        return {
            current: 'material_video',
        }
    },
    components: {
        'toolbar':ToolBar,
    }
}
</script>