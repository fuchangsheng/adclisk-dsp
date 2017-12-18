<template>
    <div class ="ac-part">
        <div class="ac-rg-top">
            地区
        </div>
        <div class="ac-rg-content">
            <div></div>
            <region></region>
        </div>
    </div>
</template>
<script>
import Region from './Region/Region'
export default {
    name: 'regionalDistribution',
    components: {
        Region                      
    }
   
}
</script>
<style>
    .ac-rg-top{
        font-size: 20px;
        background-color: #f5f7f8;
        padding-left: 15px;
        line-height: 50px;

        height: 50px;
    }
    .ac-rg-content {
        border-top: 1px solid #ccc;
        padding-left: 15px;
        padding-top: 20px;
    }
</style>
