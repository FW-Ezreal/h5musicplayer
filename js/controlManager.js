//管理index检索
(function($, root) {
	function controlManager(length) {
		this.index = 0;
		this.length = length;
	}
	controlManager.prototype = {
		//下一首
		next:function() {
			return this.getIndex(1);
		},
		//上一首
		prev:function() {
			return this.getIndex(-1);
		},
		getIndex:function(val){
			var index = this.index;
			var len = this.length;
			var curIndex = (index + val +len) % len;
			this.index = curIndex;
			return curIndex;
		}
	}
	root.controlManager = controlManager;
}(window.Zepto, window.player || (window.player = {})))