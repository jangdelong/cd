/*
 * @name 音乐盒特效
 * @author Jelon Cheung
 * @date 2014-6-14
 * @copyright http://jelon.in
 * @version 0.1
 *
 */

(function() {

	'use strict';

	/*------------- 音乐源文件 --------------*/
	var	audio = document.createElement('audio');
	//加载歌曲文件
	audio.src = 'source/0.mp3';
	audio.setAttribute('id', 'm_0');
	audio.setAttribute('loop', 'true');
	document.body.appendChild(audio);
	
	var m_0 = $$('m_0'),					//歌曲源
		dvd = $$('dvd'),					//音乐盒转盘
		progress_bar = $$('progress_bar'),	//滚动条
		play_btn = $$('playBtn'),			//播放按钮
		timer = null,					
		played = 0;

	/*------------- 音乐盒播放功能 --------------*/
	var xhr,
		lrc_box = $$('lrc_box'),			//歌词容器
		lrc_url = 'data/0.lrc',				//歌词路径
		lrc_val = '',						//歌词内容
		lrc_arr = [],						//歌词转化数组
		music_name = '',					//歌曲名
		lrc_time_arr = [],					//歌词时间轴
		counter = 0,
		lrc_time = 0,
		lrc_timer = null;

	//加载歌词
	loadLrc(lrc_url);

	//播放按钮事件
	play_btn.onclick = function() {

		if (m_0.paused) {
			m_0.play();
			this.innerHTML = '||';
			dvd.className = 'dvd animation-running';
			timer = setInterval(function() {
				played = m_0.currentTime/m_0.duration;
				progress_bar.style.width = played*100 + '%';
			}, 500);

			changeLrc();
		} else {
			m_0.pause();
			this.innerHTML = '&gt;';
			dvd.className = 'dvd';
			clearInterval(timer);
			clearTimeout(lrc_timer);
			timer = null;
			lrc_timer = null;
		}
	};
	play_btn.onmouseover = function() {
		this.style.borderColor = '#9cc';
		this.style.color = '#9cc';
	};
	play_btn.onmouseout = function() {
		this.style.borderColor = '';
		this.style.color = '';
	};


	//加载歌词
	function loadLrc(url) {
		if (url === '') {
			lrc_box.innerHTML = '歌词不存在！'; 
			return;
		}
		if (window.XMLHttpRequest) xhr = new XMLHttpRequest();
		else if (window.ActiveXObject) {
			xhr = new ActiveXObject('Microsoft.XMLHTTP');
		} else {
			alert('浏览器不支持XMLHTTP！');
		}

		if (xhr) {
			xhr.onreadystatechange = getXhrData;
			xhr.open('get', url, true);
			xhr.send(null);
		}

	}
	//获取歌词数据
	function getXhrData() {
		if (xhr.readyState === 4 && (xhr.status === 0 || xhr.status === 200)) {
			lrc_val = xhr.responseText;
			lrc_arr = lrc_val.replace(/\[\d\d:\d\d.\d\d]/g, '').split('\n');	//获取歌词转化数组
			music_name = lrc_arr[0];

			//获取时间轴
			lrc_val.replace(/\[(\d*):(\d*)([\.|\:]\d*)\]/g, function() {
			    var m = arguments[1] | 0, 		//分
			        s = arguments[2] | 0, 		//秒
			        total_s = m*60 + s; 		//计算总秒数
			    lrc_time_arr.push(total_s);
			});
		}
		$$('music_name').innerHTML = music_name;
	}
	//计算显示歌词
	function changeLrc() {
		if (counter < lrc_time_arr.length) {

			//设置正在播放的歌词高亮样式
			lrc_box.style.color = '';
			lrc_box.innerHTML = lrc_arr[counter];
			setTimeout(function() {
				lrc_box.style.color = '#09c';
			}, 500);

			counter++;

			//暂停再播放情况，消除误差
			if (m_0.currentTime > 0)  { 

				if (m_0.currentTime*1000 < lrc_time_arr[counter-1]*1000) {
					counter--;
				}
				lrc_time = lrc_time_arr[counter]*1000 - m_0.currentTime*1000;

			//最开始播放情况
			} else {	
				lrc_time = lrc_time_arr[counter]*1000 - lrc_time_arr[counter-1]*1000;
			}
		
			lrc_timer = setTimeout(function() {
			 	changeLrc();
			}, lrc_time);
		} else {
			//歌词循环
			if (m_0.currentTime == 0 || m_0.ended) counter = 0;
			
			if (counter >= lrc_time_arr.length) lrc_box.innerHTML = lrc_arr[lrc_time_arr.length-1];
			else { 
				//设置正在播放的歌词高亮样式
				lrc_box.style.color = '';
				lrc_box.innerHTML = lrc_arr[counter];
				setTimeout(function() {
					lrc_box.style.color = '#09c';
				}, 500);
			}


			counter++;
			//歌词遍历结束临界情况
			if (counter >= lrc_time_arr.length) lrc_time = m_0.duration*1000 - lrc_time_arr[length-1];
			else lrc_time = lrc_time_arr[counter]*1000 - lrc_time_arr[counter-1]*1000;
			//递归操作
			lrc_timer = setTimeout(function() {
			 	changeLrc();
			}, lrc_time);
		}
	}

	function $$(id) {
		return document.getElementById(id);
	}

})();
