function Ttag(opt) {
	var elementid = opt.el;
	/*var data = opt.data;
    var url = opt.url;*/
	this.opt = opt;
	this.pattern = this.opt.pattern || "&,&";
	this.editarea = document.querySelector(elementid);
	this.selectArea = this.editarea.querySelector(".t-tag-select-item-con"); //选择区域块，用来显示默认的标签
	this.inputForm = this.selectArea.querySelector("input"); //隐藏的表单，用来存储实际值
	this.tag = { _show: false }; //是否显示 默认标签选择区域块
	this.hideSelTag = this.hideSelTag.bind(this); // 隐藏 默认标签选择区域块
	this.onClose = this.opt.onClose || undefined;
	this.onTagClick = this.opt.onTagClick || undefined;
	this.onAdd = this.opt.onAdd || undefined;
	this.maxSize = this.opt.maxSize || 0;
	this.init();
	if (opt.value) {
		this.setData(opt.value);
	}
	if (opt.url) {
		this.ajax({
			url: opt.url,
			onLoaded: opt.onLoaded ? opt.onLoaded : null,
		});
	}
}
Ttag.prototype.ajax = function ({ method = "post", url, data, onLoaded, flag = true }) {
	var xhr = null,
		$this = this; //创建一个ajax对象
	//-------先封装兼容IE版本
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	} else {
		xhr = new ActiveXObject("Microsoft.XMLHttp");
	}
	//3.open过程
	if (method == "GET") {
		xhr.open(method, url + "?" + data, flag);
		//4.send过程
		xhr.send();
	} else if (method == "post") {
		//3.open过程
		xhr.open(method, url, flag);
		xhr.setRequestHeader("Content-type", "application/json");
		// xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		//4.send过程
		xhr.send(data);
	}
	//5.监听
	//由于send是一个异步的过程所以不能用xhr.readyState == 4来判断
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				onLoaded && onLoaded(xhr.responseText, $this);
			}
		}
	};
};

Ttag.prototype.setData = function (value) {
	var arr = value.split(",");
	for (var index in arr) {
		this.addTag(arr[index], false);
	}
};
/**
 * [init 初始化]
 * @Author tanglv   2020-11-02
 * @return {[type]} [description]
 */
Ttag.prototype.init = function () {
	var $this = this;
	Object.defineProperties(this.tag, {
		show: {
			get: function () {
				return this._show;
			},
			set: function (val) {
				var classname = $this.selectArea.getAttribute("class");
				if (val) {
					//显示
					classname = classname.replace("close-ttag", "");
					document.addEventListener("click", $this.hideSelTag);
				} else {
					//隐藏
					classname = classname.concat("close-ttag");
					document.removeEventListener("click", $this.hideSelTag);
				}
				$this.selectArea.setAttribute("class", classname); //将值重设给dom的class属性
				this._show = val;
			},
		},
		size: {
			get: function () {
				return $this.inputForm.value.split($this.pattern).filter((item) => (item ? true : false)).length;
			},
		},
	});
	//编辑区域点击事件
	this.editarea.addEventListener("click", function (event) {
		event.stopPropagation();
		event.preventDefault();
		//删除 tag
		if (event.target.getAttribute("class") === "edit-item-del-con") {
			var delText = event.target.parentNode.querySelector(".edit-item-text").innerHTML;
			$this.delFormData(delText);
			event.target.parentNode.parentNode.removeChild(event.target.parentNode);
			return;
		}
		if (event.target.getAttribute("class") === "edit-item-del") {
			var delText = event.target.parentNode.parentNode.querySelector(".edit-item-text").innerHTML;
			$this.delFormData(delText);
			event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);
			return;
		}
		if (event.target.getAttribute("class") === "edit-item-text") {
			$this.onTagClick && $this.onTagClick(event.target.textContent);
			return;
		}
		//显示 提供的tag选项
		if (!$this.tag.show) {
			$this.tag.show = true;
		}
		//手动新增 tag
		if (event.target.getAttribute("class") === "t-tag-con") {
			$this.newTag();
		}
	});
	//选择区域点击事件
	this.selectArea.addEventListener("click", function (event) {
		event.stopPropagation();
		if (event.target.getAttribute("class") === "t-tag-item") {
			$this.addTag(event.target.innerHTML);
		}
	});

	this.loadData();
};

/**
 * [删除表单数据]
 * @Author tanglv   2021-04-01
 */
Ttag.prototype.delFormData = function (val) {
	val && (this.inputForm.value = this.inputForm.value.replace(val + this.pattern, ""));
	this.onClose && this.onClose(val);
};
/**
 * [loadData 载入数据]
 * @Author tanglv   2020-11-02
 * @param  {[type]} data       [description]
 * @return {[type]}            [description]
 */
Ttag.prototype.loadData = function (data) {
	var $this = this;
	var tmpData = this.opt.data && this.opt.data.length ? this.opt.data : [];
	tmpData = data && data.length ? data : [];
	if (tmpData.length) {
		var inputVal = "";
		var fragment = document.createDocumentFragment();
		tmpData.forEach(function (item) {
			inputVal += item + $this.pattern;
			var textSpan = document.createElement("span");
			textSpan.setAttribute("class", "t-tag-item");
			textSpan.innerHTML = item;
			fragment.appendChild(textSpan);
		});
		// this.inputForm.value = inputVal;

		this.selectArea.appendChild(fragment);
	}
};
/**
 * [getFormData 获取表单数据]
 * @Author tanglv   2020-11-02
 * @param  {[type]} type       [description]
 * @return {[type]}            [description]
 */
Ttag.prototype.getFormData = function (type) {
	type = type || "string";
	if (type === "string") {
		return this.inputForm.value;
	} else {
		return this.inputForm.value.split(this.pattern);
	}
};
/**
 * [addTag 增加标签]
 * @Author tanglv   2020-11-02
 * @param  {[type]} text       [description]
 */
Ttag.prototype.addTag = function (text, fireEvent) {
	if (this.maxSize && this.tag.size >= this.maxSize) {
		return;
	}
	if (this.isDuplicate(text)) {
		return;
	}

	var li = document.createElement("li");
	li.setAttribute("class", "edit-item");

	var textSpan = document.createElement("span");
	textSpan.setAttribute("class", "edit-item-text");
	textSpan.innerHTML = text;
	var closeSpan = document.createElement("span");
	closeSpan.setAttribute("class", "edit-item-del");
	var closeSpanCon = document.createElement("span");
	closeSpanCon.setAttribute("class", "edit-item-del-con");
	closeSpanCon.appendChild(closeSpan);
	li.appendChild(textSpan);
	li.appendChild(closeSpanCon);
	this.editarea.appendChild(li);

	this.inputForm.value = this.inputForm.value + text + this.pattern;
	this.onAdd && fireEvent !== false && this.onAdd(text, this.inputForm.value);
};
/**
 * [isDuplicate 检查是否有重复值]
 * @Author tanglv    2020-11-02
 * @param  {[type]}  value      [description]
 * @return {Boolean}            [description]
 */
Ttag.prototype.isDuplicate = function (value) {
	var isDuplicate = false;
	var vals = this.inputForm.value.split(this.pattern);
	for (var i = 0, len = vals.length; i < len; i++) {
		if (vals[i] === value) {
			isDuplicate = true;
			break;
		}
	}
	return isDuplicate;
};
/**
 * [hideSelTag 隐藏选择框]
 * @Author tanglv   2020-11-02
 * @return {[type]} [description]
 */
Ttag.prototype.hideSelTag = function () {
	console.log("选择框隐藏");
	this.tag.show = false;
};

/**
 * [newTag 手动新增标签 ] 没有边框的文本输入框
 * @Author tanglv   2020-11-02
 * @return {[type]} [description]
 */
Ttag.prototype.newTag = function () {
	var $this = this;
	if (this.editarea.querySelector(".ttag-input")) {
		return;
	}
	var li = document.createElement("li");
	li.setAttribute("class", "edit-item input-edit-item");
	var tmpInput = document.createElement("input");
	tmpInput.setAttribute("class", "ttag-input");
	li.appendChild(tmpInput);
	this.editarea.appendChild(li);

	var tmpInput1 = this.editarea.querySelector(".ttag-input");

	tmpInput1.addEventListener("blur", function () {
		console.log("失去焦点");
		//将输入框的值 添加为显示值
		if (this.value) {
			$this.addTag(this.value);
		}
		this.parentNode.parentNode.removeChild(this.parentNode); //删除临时生成的 input 输入框
		console.log("焦点移除");
	});

	tmpInput1.addEventListener("compositionstart", function (e) {
		$this.delFlag = true;
	});

	tmpInput1.addEventListener("compositionend", function (e) {
		$this.delFlag = false;
	});

	tmpInput1.addEventListener("keyup", function (e) {
		if (e.keyCode === 13) {
			console.log("进入回车");
			if (this.value) {
				this.blur();
				setTimeout(function () {
					console.log("回车重新聚焦");
					$this.editarea.click();
				});
			}
		}
	});

	tmpInput1.addEventListener("keydown", function (e) {
		if (e.keyCode === 8) {
			if (e.target.value.length || $this.delFlag) {
				return;
			}
			//删除前一个标签
			var childs = $this.editarea.querySelectorAll(".edit-item:not(.input-edit-item)");
			console.log(childs);
			if (childs.length) {
				var deleteChild = [].slice.call(childs).pop();
				$this.delFormData(deleteChild.firstElementChild.textContent);
				$this.editarea.removeChild(deleteChild);
			}
		}
	});

	tmpInput1.addEventListener("click", function (e) {
		e.stopPropagation();
		e.preventDefault();
	});
	this.editarea.querySelector(".ttag-input").focus();
};
