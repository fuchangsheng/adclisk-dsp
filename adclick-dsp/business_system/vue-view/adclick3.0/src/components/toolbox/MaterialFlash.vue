<template>
    <div>
        <toolbar></toolbar>
    </div>
</template>
<script>
import ToolBar from './MaterialFlash/ToolBar';
export default {
    name: 'material_flash',
    data(){
        return {
            current: 'material_flash',
        }
    },
    components: {
        'toolbar':ToolBar,
    }
}
</script>