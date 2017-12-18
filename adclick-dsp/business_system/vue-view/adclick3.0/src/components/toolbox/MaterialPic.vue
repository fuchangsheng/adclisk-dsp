<template>
    <div>
        <toolbar></toolbar>
        <picview></picview>
    </div>
</template>
<script>
import ToolBar from './MaterialPic/ToolBar';
import PicView from './MaterialPic/PicView';
export default {
    name: 'material_pic',
    data(){
        return {
            current: 'material_pic',
        }
    },
    components: {
        'toolbar':ToolBar,
        'picview':PicView,
    }
}
</script>