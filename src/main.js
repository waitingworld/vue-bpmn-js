import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
/*左边工具栏以及编辑节点的样式*/
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
/*右边工具栏样式*/
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
/*实施校验的样式*/
import 'bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css'
/*小地图样式*/
import 'diagram-js-minimap/assets/diagram-js-minimap.css'
/*代码编辑器*/
import 'codemirror/lib/codemirror.css'
// xml syntax highlighting
import 'codemirror/mode/xml/xml'
// auto close tags
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/edit/closetag'
// search addons
import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/dialog/dialog.css'
//令牌模拟
import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css'
import 'bpmn-js-token-simulation/assets/css/normalize.css'
import 'bpmn-js-token-simulation/assets/font-awesome/css/font-awesome.min.css'
import 'bpmn-js-token-simulation/assets/font-awesome/fonts/fontawesome-webfont.eot'
import 'bpmn-js-token-simulation/assets/font-awesome/fonts/fontawesome-webfont.svg'
import 'bpmn-js-token-simulation/assets/font-awesome/fonts/fontawesome-webfont.ttf'
import 'bpmn-js-token-simulation/assets/font-awesome/fonts/fontawesome-webfont.woff'
import 'bpmn-js-token-simulation/assets/font-awesome/fonts/fontawesome-webfont.woff2'

Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
    render: h => h(App),
}).$mount('#app')
