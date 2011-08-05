// ==UserScript==
// @name           Google+ Tweaks
// @description    Tweaks to the layout and features of Google+
// @author         Jerome Dane
// @website        http://userscripts.org/scripts/show/106166
// @version        0.021
//
// License        Creative Commons Attribution 3.0 Unported License http://creativecommons.org/licenses/by/3.0/
//
// Copyright (c) 2011 Jerome Dane
//
// Permission is hereby granted, free of charge, to any person obtaining 
// a copy of this software and associated documentation files (the "Software"), 
// to deal in the Software without restriction, including without limitation the 
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
// sell copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all 
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
// CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// @include        http://plus.google.com/*
// @include        https://plus.google.com/*
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @require        http://userscripts.org/scripts/source/106368.user.js
// @require        http://userscripts.org/scripts/source/106223.user.js
//
// @history        0.021 Fixes to handle change in Google Plus code
// @history        0.021 Fixed stream not jumping to top when clicking stream links with fixed navigation
// @history        0.021 Added ability to hide notice of new people sharing with you
// @history        0.021 Added collapse comments button to end of post comment lists
// @history        0.021 Number of comments now auto-updates when comments are collapsed
// @history        0.021 Increased polling interval to 3 seconds from 1 to reduce resource usage
// @history        0.021 Fixed Sparks layout in full width mode
// @history        0.021 Replaced "mute this post" in incoming feed with mute button when using fast mute
// @history        0.020 Added check for /h#/ image resize format for previews
// @history        0.020 Imposed max height and width on preview images of window size - 40px
// @history        0.019 Quick attempt to fix persistent "all images to preview image" bug
// @history        0.019 Fixed preview images stretching off the window to the right
// @history        0.018 Fixed broken/buggy image preview
// @history        0.018 You can now choose the delay before showing image previews
// @history        0.018 Avatars in "added you to circles" notifications now use image previews
// @history        0.018 Profile pictures in left column of profiles now use image previews
// @history        0.018 Photos in profile pages now use image previews
// @history        0.018 Fixed left column width on notifications feed when using full width
// @history        0.017 Improve stability of mute button 
// @history        0.016 Started refactoring all code to make it easier to maintain 
// @history        0.016 Removed hide post button options (not really used anymore) 
// @history        0.016 Better control of hiding/fading mute notices  
// @history        0.016 Ability to fix just the google bar or all navigation  
// @history        0.016 Attempted to fix posts out of view when using J/K key navigation  
// @history        0.016 Attempted to fix some fixed navigation issues  
// @history        0.016 Clicking on streams now auto scrolls back to top when using fixed navigation  
// @history        0.016 Clicking on buttons in top bar now auto scrolls back to top when using fixed navigation  
// @history        0.016 Added inline +1 and shares option to clean up the page
// @history        0.016 Added toggle comments option
// @history        0.015 Improved positioning and stability of image previews 
// @history        0.015 Increased max size of previews to window height - 40 pixels 
// @history        0.015 Fixed circles view being unusable with fixed navigation enabled 
// @history        0.015 Added easy mentioning [+] symbol after profile names (enabled by default) 
// @history        0.015 "Add to circles" and "in circles" button now fixed on profile pages for fixed nav (thanks Matt Kruse) 
// @history        0.015 Fixed inability to scroll profile columns when using fixed navigation and small windows (thanks Terry May)
// @history        0.014 Added fast mute option to add a mute button and remove muted notice 
// @history        0.014 Removed post buttons option 
// @history        0.013 Added favicon badge to show number of new notices 
// @history        0.012 Added option to fix navigation elements 
// @history        0.011 Fixed stretching of images in previews to 400px when the original is smaller
// @history        0.011 Preview images now work on hangout notice avatars
// @history        0.010 Prevented execution of script within iFrames such as notifications preview popup
// @history        0.010 Increased the width of rollover previews to 400 from 300 (may be a setting eventually)
// @history        0.010 Image rollover preview will now reposition itself to stay within the viewable window
// @history        0.010 Image rollover preview now works on avatars in posts
// @history        0.010 Image rollover preview now works on avatars in vCards (little person previews)
// @history        0.010 Fixed handling of preview images with sz=## in the source
// @history        0.009 Added rollover previews to images in posts
// @history        0.009 Added MIT license to source
// @history        0.008 Display post actions as buttons instead of a dropdown menu (disabled by default)
// @history        0.008 Added a "Hide" tab to the options window to allow hiding Google+ elements
// @history        0.008 Added a donate button to the about tab of the options window
// @history        0.007 Yellow "post muted" notices will now fade out after a few seconds
// @history        0.006 Fixes to Thumbnails Only feature
// @history        0.005 Images in posts can now forced to thumbnails
// @history        0.004 Added options dialog with link in Google settings menu
// @history        0.004 Full width feature can now be disabled
// @history        0.003 Fixed header not left aligned in Google Chrome
// @history        0.003 Notifications view is now full width
// @history        0.003 Included jQuery UI in anticipation of next version 
// @history        0.003 Included Script Options in anticipation of next version 
// @history        0.002 Profiles are now full width as well
// @history        0.001 Initial release
//
// ==/UserScript==

var debugSelectors = false;

var selectors = {
	content: '#content',
	contentPane: '#contentPane',
	googleBar: '#gb',
	toolBar: '.a-aa-S.a-c-aa-S'
};
selectors.widthRestrictor = '.wy';
selectors.chatRoster = '#oz-chat-roster';
selectors.stream = selectors.content + ' .a-m-C-S.a-C.a-m-C-wb-Qb'
selectors.streamLeftCol = selectors.stream + ' .a-m-mb-S.d-q-p.a-c-m-mb-S';
selectors.welcomeLink = selectors.streamLeftCol + ' h2 + a.d-k.a-c-k-eb.a-mb-k.a-mb-B7';
selectors.streamContent = selectors.stream + ' .a-m-K-S.a-m-K-S-Rh-wb'
selectors.streamRightCol = selectors.stream + ' .a-c-qC-S.a-qC-S.d-q-p';
selectors.streamRightColSuggestions = selectors.streamRightCol + ' .T0';
selectors.streamNotificationCol = selectors.stream + ' .a-m-K-S.a-m-K-S-Kr-wb';
selectors.streamLinksWrapper = '.a-c-mb-C';
selectors.streamShareWrapper = selectors.stream + ' .ev.Au + div';
selectors.incomingNotice = '.a-gb-C.a-c-gb-C';
selectors.incomingNoticeAvatar = selectors.incomingNotice + ' .d-q-p.a-gb-xC';
selectors.incomingNoticeNumMore = selectors.incomingNotice + ' .d-q-p.a-gb-BA';
selectors.incomingPostedBy = selectors.contentPane + ' .ov.SD';
selectors.incomingPostedByAddToCircles = selectors.incomingPostedBy + ' .hr.uz.d-q-p';
selectors.incomingPostedByMutePost = 'span.d-k.ir.xz';
selectors.sparksStream = '.a-m-K-S.a-m-K-S-Kr-wb';
selectors.sparksSearchButton = selectors.sparksStream + ' .d-q-p.j-e.j-e-Y.l2.e1';
selectors.sparksAddInterestButton = selectors.sparksStream + ' .d-q-p.j-e.j-e-Y.b1.i2';
selectors.profile = selectors.content + ' .a-m-K-S.a-m-K-S-Tf-wb';
selectors.profileContent = selectors.profile + ' .a-c-b-m-wc.a-b-m-wc'; 
selectors.profileLeftCol = selectors.profile + ' .a-c-b-Fa-wc.a-b-Fa-wc';
selectors.post = 'div[id^="update"]';
selectors.postCommentsWrapper = '.Ol.iv';
selectors.postComment = '.Ly.Tk';
selectors.postCommentButton = '.d-k.wf';
selectors.postCommentsOld = '.My.al';
selectors.postCommentsMoreButton = '.d-k.Ck';
selectors.postCommentsOldButton = '.d-k.Dk[role="button"]';
selectors.postButton = selectors.post + ' span.d-k.Jt.Oi';
selectors.postPlussesAndShares = ' .dl.pz';
selectors.postPlussesWrapper = ' .lv';
selectors.postPlusses = ' .PD.zp.d-q-p.Zf';
selectors.postPlusOneButton =  ' .Jn button';
selectors.postSharesWrapper = ' .mv';
selectors.postShareButton = 'span.d-k.cl[role="button"]';
selectors.postShares = ' span.d-k.gr';
selectors.postMuteButton = '.a-Y-k.d-V.a-Y-k-ye.Sl.Ki';
selectors.photosWrapper = '.a-g-ra-K.a-m-K.Te-K[token="photos"]';
selectors.leftColPhotos = selectors.photosWrapper + ' > .a-g-lm';
selectors.footer = '.a-Sa-S.a-c-Sa-S';
selectors.muteNotice = selectors.post + '.tf.Ek.vp.nk';
selectors.sendFeedback = 'a.a-Wj-Lh';
	
if(debugSelectors && $(selectors.content).size() > 0) {
	setTimeout(function() {
		var html = '<div id="bcGPTksSelectorDebug" style="position:absolute; top:0; left:0; font-weignt:normal; padding:1em; border:1px solid #000; background:#fff; z-index:99999;">';
		html += '</div>';
		function debugSelectors() {
			var html = '<p>Selectors Found:</p>';
			for(var x in selectors) {
				var numFound = $(selectors[x]).size();
				html += '<span style="' + (numFound == 0 ? 'color:red;' : '') + '">' + x + ' ' + numFound + '</span><br/>';
			}
			$('#bcGPTksSelectorDebug').html(html);
		}
		debugSelectors();
		setInterval(debugSelectors, 3000);
		$('body').append(html);
	}, 2000);
}



var hangoutNoticeAvatarSelector = '.a-f-i-ie-p img[src*="googleusercontent"]';
var myAvatarSelector = 'img.a-b-c-y-ma.photo';
var postBodySelector = selectors.post + ' .Ty';
var postAvatarSelector = selectors.post + ' img.Nt.hm';
var postMenuSelector = selectors.post + ' .Cp.d-E[role="menu"]';


var playVideoIconSelector = '.ea-S-ei';

var postMediaSelector = '#content ' + postBodySelector + ' img[src*="googleusercontent"]';
var postAddCommentSelector = selectors.post + ' span.d-h.a-b-f-i-W-h[role="button"]';
var postMenuItemSelector = postMenuSelector + ' div[role="menuitem"]';
var profileColumnSelector = '.a-b-c-ka-Mc.a-c-ka-Mc'
var profileLinkSelector = 'a[oid]';
var rightColSelector = '.a-b-Cs-T.a-Cs-T.d-s-r';
var suggestionsSelector = '.a-b-j-lc-Rd-A';
var sharedByIncomingNoticeSelector = '.a-f-i-Jf-Om.a-b-f-i-Jf-Om';
var vCardSelector = 'table.a-ia-ta';
var vcardAvatarSelector = vCardSelector + ' img.a-ia-tk[src*="googleusercontent"]';
var vcardAvatarInCommonSelector = vCardSelector + ' img.a-ia-Bq[src*="googleusercontent"]';


var previewHeightMax = $(window).height() - 40;
var previewWidthMax = previewHeightMax;
var currentPreviewTarget = false;

function GTweaks() {
	var self = this;
	this.css = '';
	this.pollInterval = 3000;		// in milliseconds
	this.pollFuncions = [];
	this.version = 0.021;
	this.options = {
		"General":{
			"faviconBadge":{
				label:'Favicon Badge',
				type:'checkbox',
				description:'See the number of new alerts in your favicon',
				'default':true
			},
			"fullWidth":{
				label:'Full Width',
				type:'checkbox',
				description:'View Google+ in the full width of your browser',
				'default':true
			},
			"muteButton":{
				label:'Mute Button',
				type:'checkbox',
				description:'Add button to posts for one click muting',
				'default':true
			},
			"muteNotices":{
				label:'Mute Notices',
				type:'select',
				options:{
					none:'Do nothing',
					fade:'Fade out',
					hide:'Hide'
				},
				description:'Treatment of "post muted" notices',
				'default':'none'
			},
			"easyMentions":{
				label:'<span title="Currently broken due to changes in the Google Plus DOM" style="text-decoration:line-through">Easy Mentions</span>',
				type:'checkbox',
				description:'<span title="Currently broken due to changes in the Google Plus DOM" style="text-decoration:line-through">Add links next to names in posts to easily mention them</span>',
				'default':false
			},
			"imagePreviews":{
				label:'<span title="Currently broken due to changes in the Google Plus DOM" style="text-decoration:line-through">Image Previews</span>',
				type:'select',
				options:{
					'none':'Disabled',
					'0':'No delay',
					'500': '0.5 second delay',
					'1000': '1 second delay',
					'2000': '2 second delay'
				},
				description:'<span title="Currently broken due to changes in the Google Plus DOM" style="text-decoration:line-through">Show image preview on rollover</span>',
				'default':'none'
			},
			"comments":{
				label:'Toggle Comments',
				type:'checkbox',
				description:'Collapse post comments with click to expand',
				'default':false
			},
			"inlinePlusShare":{
				label:'Inline +1/shares',
				type:'checkbox',
				description:'Show the number of +1s and shares inline',
				'default':true
			},
			"thumbsOnly":{
				label:'<span title="Currently broken due to changes in the Google Plus DOM" style="text-decoration:line-through">Thumbnails Only</span>',
				type:'checkbox',
				description:'<span title="Currently broken due to changes in the Google Plus DOM" style="text-decoration:line-through">Force all images in posts to thumbnails</span>',
				'default':false
			},
			"fixedNav":{
				label:'Fixed Navigation',
				type:'select',
				options:{
					none: 'None',
					gBar: 'Google Bar',
					all: 'All Navigation'
				},
				description:'Pin elements so they stay visible',
				'default':'none'
			},
			'seeAbout':{
				type:'html',
				text:'<div><br/></div>' +
					'<p>More features coming soon. See <strong>About</strong> tab for more details information.</p>'
			}
		},
		"Hide":{
			"hideWelcomeLink":{
				label:'Welcome Link',
				type:'checkbox',
				description:'Hide the welcome link in the left column'
			},
			"hideChatRoster":{
				label:'Chat List',
				type:'checkbox',
				description:'Hide the chat list in the left column'
			},
			"hideIncomingNotice":{
				label:'Incoming Notice',
				type:'checkbox',
				description:'Hide "# new people are sharing with you" notice'
			},
			"hideSendFeedback":{
				label:'Send Feedback',
				type:'checkbox',
				description:'Hide the send feedback link in the borrom right'
			},
			"hidePlusMention":{
				label:'Mention Prefix',
				type:'checkbox',
				description:'Hide the "+" symbol before mentions in posts'
			},
			"hideRightColLabel":{
				type:'html',
				text:'<p"> </p>'
			},
			"hideRightCol":{
				label:'Right Column',
				type:'checkbox',
				description:'Hide the entire right column'
			},
			"hideSuggestions":{
				label:'Suggestions',
				type:'checkbox',
				description:'Hide suggestions of people to follow'
			},
			"hideGoMobile":{
				label:'Go Mobile',
				type:'checkbox',
				description:'Hide the "Go Mobile" section'
			},
			"hideSendInvites":{
				label:'Send Invites',
				type:'checkbox',
				description:'Hide the "Send Invites" section'
			}
		},
		"About":{
			'about':{
				type:'html',
				text:'<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=773DHSKBK7PXQ" title="Show your love for Google+ Tweaks"><img src="https://lh3.googleusercontent.com/-I9688G68QNo/ThpTzbY_xjI/AAAAAAAAAHA/yhD7MXWhvKw/green_100.png" style="float:right;"/></a>' +
					'<p style="margin-top:0;"><strong><a href="http://userscripts.org/scripts/show/106166">' +
					'Google+ Tweaks</a></strong> v' + self.version + ' by <a href="">Jerome Dane</a></p>' +
					'<p>Tweaks to the layout and features of Google+</p>' +
					'<p>This project is maintained as a hobby. All real-life obligations take precedence. Take it or leave it.</p>' +
					'<p>This is an alpa release, which means it\'s under heavy development. ' +
						'If you find something wrong or have suggestions, just post a comment in the ' +
						'<a href="http://userscripts.org/scripts/discuss/106166">discussions</a>. ' +
						'I will release updates as I can.</p>' +
					'<p>' +
						'<a href="https://plus.google.com/107905455800180378660/posts">' +
							'<img style="display:inline-block; vertical-align:middle;" src="https://lh3.googleusercontent.com/-IvtEWk93sCM/ThitYp1QudI/AAAAAAAAAGY/piLimw2CogM/google_plus_badge_32.png"/>' +
						'</a>' +
						' For updates, <a href="https://plus.google.com/107905455800180378660/posts">follow me on Google+</a>' +
					'</p>'
			}
		}
	};
	this.selectors = {
		muteNotice: selectors.post + '.Of.al.zp.Kk',
		post: '#content div[id^="update"]',
		postBody: '.a-b-f-S-oa',
		postMedia: '#content .a-b-f-S-oa img[src*="googleusercontent"]'
	};
	this.features = {
		favicon: {
			src: 'data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AJubm3guLi7/Ly8v/zExMf8yMjL/MjIy/zMzM/8yMjL/MjIy/zExMf8vLy//Li4u/y0tLf+enp50////AP///wAvLy//MTEx/zMzM/80NDT/NTU1/zY2Nv8mJib/JiYm/zU1Nf80NDT/MjIy/zAwMP8uLi7/LS0t/////wD///8AMjIy/zQ0NP82Njb/ODg4/zo6Ov87Ozv/09HR/9PR0f86Ojr/ODg4/zY2Nv80NDT/MjIy/y8vL/////8A////ADU1Nf84ODj/Ozs7/z09Pf8/Pz//QEBA/+Pi4v/j4uL/Pz8//z09Pf87Ozv/ODg4/zU1Nf8yMjL/////AP///wA5OTn/PDw8/z8/P/8tLS3/Ly8v/y8vL//o5+f/6Ofn/y8vL/8tLS3/LCws/zw8PP85OTn/NTU1/////wD///8APDw8/0BAQP9CQkL/7ezs/+3s7P/t7Oz/7ezs/+3s7P/t7Oz/7ezs/+3s7P8/Pz//Ozs7/zg4OP////8A////AD8/P/9CQkL/RUVF//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/QkJC/z4+Pv86Ojr/////AP///wBAQED/RERE/0dHR/9JSUn/SUlJ/0lJSf/29fX/9vX1/0lJSf9JSUn/R0dH/0RERP9AQED/PDw8/////wD///8AQkJC/0ZGRv9ISEj/SUlJ/0lJSf9JSUn/+fn5//n5+f9ISEj/SEhI/0dHR/9GRkb/QkJC/z4+Pv////8A////AENDQ/9HR0f/SUlJ/0lJSf9JSUn/SUlJ//39/f/9/f3/SUlJ/0lJSf9JSUn/R0dH/0NDQ/8/Pz//////AP///wBERET/R0dH/0lJSf9JSUn/SUlJ/0lJSf9JSUn/SUlJ/0lJSf9JSUn/SUlJ/0dHR/9DQ0P/Pz8//////wD///8ANzc3/zo6Ov88PDz/PDw8/zw8PP88PDz/PDw8/zw8PP88PDz/PDw8/zw8PP86Ojr/Nzc3/zQ0NP////8A////AA8P1f8PD9X/Dw/V/+hpM//oaTP/6Gkz/+hpM/8lmQD/JZkA/yWZAP8mkwP/EbLu/xGy7v8Rsu7/////AP///wCHh+p+Dw/V/w8P1f/oaTP/6Gkz/+hpM//oaTP/JZkA/yWZAP8lmQD/JpQE/xGy7v8Rsu7/jNr2ef///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A//8AAMADAACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAADAAwAA//8AAA%3D%3D', 
			icon: null,
			init: function() {
				var icon = new FavIcon(self.features.favicon.src);
				icon.foreground = '#fef4ac'; 
				icon.background = '#bb0000'; 
				self.features.favicon.icon = icon;
				self.features.favicon.checkForNotices();
			},
			checkForNotices: function() {
				var numNotices = $('#gbgs1').text();
				if(numNotices.toString().match(/^\d+$/) && numNotices.toString() != '0') {
					self.features.favicon.icon.set(numNotices);
				} else {
					self.features.favicon.icon.set();
				}
				setTimeout(self.features.favicon.checkForNotices, 5000);
			}
		},
		fixedNavigation: {
			init: function() {
				var leftWidth = $(selectors.streamLeftCol).width();
				var rightColOffset = ($(window).width() / 2) + 280;
				
				function fixGbar(height) {
					self.addStyle(selectors.googleBar + ' { position:fixed; top:0; width:100%; }');
					$(selectors.googleBar).parent().after('<div style="height:' + height + 'px;">&nbsp;<div>');
				}
				switch(Config.get('fixedNav')) {
					case 'gBar':
						fixGbar(30);
						break;
					case 'all':
						fixGbar(90);
						self.addStyle(selectors.toolBar + ' { position:fixed; top:30px; z-index:1000; }' +
							selectors.googleBar + ' { z-index:1200; }' +
							// stream view
							selectors.streamLeftCol + ' { position:fixed; top:90px; width:' + (leftWidth + 20) + 'px; height:' + ($(window).height() - 90) + 'px; overflow-y:auto; overflow-x:hidden; }' +
							selectors.streamRightCol  + ' { position:fixed; top:90px; ' + 
								(Config.get('fullWidth') ? 'right:0;' : 'left:' + rightColOffset + 'px;') + 
							' }' +
							selectors.streamNotificationCol + ', ' + selectors.streamContent + ' { position:relative; left:' + ($(selectors.streamLeftCol).width() + 20) + 'px; }' +
							// pictures view
							selectors.leftColPhotos + ' { position:fixed; top:90px; }' +
							// profile view
							selectors.profileLeftCol + ' { position:fixed; top:90px; ' + 
								(Config.get('fullWidth') ? '' : 'left:' + (rightColOffset - 760) + 'px;') +
							' }'
						);
						// make the doc scroll to the top on left column click
						$(selectors.streamLeftCol + ' .a-b-la-T').click(function() {
							$(document).scrollTop(0);
						});
						// make the doc scroll to the top on top grey bar button click
						$(selectors.streamLinksWrapper).click(function() {
							$(document).scrollTop(0);
						});
						// reposition document so current post is in view
						$(document).keyup(function(e) {
							switch(e.which.toString()) {
								case '74': case '75':
									setTimeout(function() {
										$(window).scrollTop($(document).scrollTop() - 60);
									}, 500);
									break;
							}
						});
						break;
				}
			}
		},
		fullWidth: {
			init: function() {
				if(Config.get('fullWidth')) {
					var leftColWidth = $(selectors.streamLeftCol).width() + 20;
					var contentWidth = $(window).width() - leftColWidth - $(selectors.streamRightCol).width();
					var notificationWidth = $(window).width() - leftColWidth - 25;
					var profileWidth = $(window).width() - $(selectors.profileLeftCol).width() - 235;
					self.addStyle(
						selectors.widthRestrictor + ' { width:100% !important; }' +
							
						selectors.contentPane + ' { height:100%; }' +
						selectors.stream + ' { position:absolute; left:0; width:100%; } ' +
						selectors.streamContent + ' { position:absolute; top:0; left:' + (leftColWidth - 20) + 'px;' +
												  ' width:' + contentWidth + 'px; margin-right:400px; height:' + $(document).height() + 'px; }' +
						selectors.streamContent + ' > div { width:100% ; }' +
						selectors.streamContent + ' > div:first-child > div { width:100%; }' +
						selectors.streamContent + ' > div:first-child > div > div { width:100%; }' +
						selectors.streamRightCol + ' { ' + (Config.get('fixedNav') == 'all' ? '' : 'position:absolute; top:0;') + ' right:20px; }' +

						selectors.profile + ', ' + selectors.profileContent + ' { width:' + profileWidth + 'px !important; }' +
						selectors.profile + ' > div { width:' + profileWidth + 'px !important; }' +
						selectors.profile + ' > div > div { width:' + profileWidth + 'px !important; }' +
						selectors.profile + ' > div > div > div { ' + profileWidth + 'px !important; }' +
						
						
						selectors.streamNotificationCol + ' { width:' + notificationWidth + 'px; }' +
						selectors.streamNotificationCol + ' > div:first-child { width:100%; }' +
						selectors.streamNotificationCol + ' > div:first-child > div { width:100%; }' +
						selectors.streamNotificationCol + ' > div:first-child > div > div { width:100% }' +
						selectors.streamNotificationCol + ' > div:first-child > div > div > div { width:100%; }' +
						selectors.streamNotificationCol + ' > div:first-child > div > div > div > div { width:95%; }' +
						selectors.incomingNotice + ' { width:100%; padding:12px 0; }' +
						selectors.incomingNotice + ' > span:first-child { margin-right:21px; }' +	// close incoming notice X
						selectors.incomingNotice + ' > span:first-child + div { margin-left:21px; margin-right:21px; }' +	// "# new people are sharing with you!"
						selectors.incomingNotice + ' > span:first-child + div + div { margin-left:21px; }' +	// first new share avatar
						selectors.incomingNotice + ' > .a-gb-wC.a-c-Ir { margin-left:21px; margin-right:21px; }' +	// "View their posts incoming >"
						selectors.incomingNoticeAvatar + ' { width:32px !important; }' +	// first new share avatar
						selectors.incomingNoticeNumMore + ' { width:100px !important; }' +	// first new share avatar
						selectors.streamShareWrapper + ' { width:' + (contentWidth - 40) + 'px !important; }' +
						selectors.sparksSearchButton + ', ' + selectors.sparksAddInterestButton + ' { width:50px !important; }' +
						selectors.sparksAddInterestButton + ' + span { position:relative; top:-25px;}' +
						selectors.footer + ' { display:none; }' +
						''
					);
				}
			}
		},
		inlinePlusShare: {
			init: function() {
				if(Config.get('inlinePlusShare')) {
					self.addStyle(
							selectors.postShareButton + ', ' + selectors.postPlusOneButton + ' { margin-right:.5em; }'
					);
					self.addPolling(self.features.inlinePlusShare.processPosts);
				}
			},
			processPosts:function() {
				$(selectors.post).each(function() {
					var post = this;
					$(selectors.postPlussesAndShares, post).each(function() {
						// plusses
						$(selectors.postPlussesWrapper, this).each(function() {
							$(this).css('border', '2px solid green');
							$(selectors.postPlusOneButton, post).after($(selectors.postPlusses, this).parent());
							$(this).remove();
						});
						// shares
						$(selectors.postSharesWrapper, this).each(function() {
							var shares = $(selectors.postShares, this);
							$(selectors.postShareButton, post).after(shares);
							$(selectors.postShareButton, post).after('(');
							$(shares).after(')');
							$(shares).html($(shares).html().replace(/[^\d]/g, ''));
							$(this).remove();
						});
						if($('*', this).size() == 0) $(this).remove();
					});
				});
			}
		},
		imagePreviews: {
			wrapper: null,
			init: function() {
				if(Config.get('imagePreviews') != 'none' && $('#gb').size() > 0) {
					var previewDiv = document.createElement('div');
					previewDiv.id = 'bcGplusTweaksPreview';
					previewDiv.innerHTML = '<div class="loading">&nbsp;</div><img id="bcGPTwksPrvImg" src=""/>';
					$(previewDiv).mousemove(self.features.imagePreviews.reposition);
					$('body').append(previewDiv);
					self.features.imagePreviews.wrapper = previewDiv;
					
					self.addStyle( '#bcGplusTweaksPreview { ' +
							'border:2px solid red; position:absolute; z-index:5000; top:0; left:0; display:none;' + 
							'max-width:' + previewWidthMax + 'px; border:4px double #333; background:#fff; box-shadow: 0 5px 8px rgba(0, 0, 0, 0.6);' +
						'}' +
							'#bcGplusTweaksPreview img { ' +
							'margin-bottom:-3px; max-width:' + previewWidthMax + 'px; display:none; ' +
							'max-height:' + ($(window).height() - 40) + 'px; ' +
							'max-width:' + ($(window).width() - 40) + 'px; ' +
						'}' +
						'#bcGplusTweaksPreview .loading { ' +
							'background:url(https://lh4.googleusercontent.com/-6CrxAryPl6o/TigTcQV2HmI/AAAAAAAAAQg/tFbeZcP4Mro/loading.gif) no-repeat center; height:50px; width:50px; }'
					);
					self.addPolling(self.features.imagePreviews.processPosts);
				}
			},
			loaded:{},
			mousePos: null,
			reposition: function() {
				var previewDiv = self.features.imagePreviews.wrapper;
				var e = self.features.imagePreviews.mousePos;
				$(previewDiv).css('left', e.pageX + 30);
				$(previewDiv).css('top', e.pageY - 30);
				
				var isLoading = $('.loading', previewDiv).css('display') == 'block';
				
				var h = isLoading ? 50 : $('#bcGPTwksPrvImg').height();
				var w = isLoading ? 50 : $('#bcGPTwksPrvImg').width();
				
				var bottom = parseInt($(previewDiv).css('top').replace(/[^\d]/, '')) + h - $(document).scrollTop();
				var right = parseInt($(previewDiv).css('left').replace(/[^\d]/, '')) + w;
				if(right > $(window).width()) {
					if(e.pageX - w - 30 > 10) {
						$(previewDiv).css('left', e.pageX - w - 30);
					} else {
						$('#bcGPTwksPrvImg').width($(window).width() - e.pageX - 60);
					}
				}
				if(bottom > $(window).height()) {
					$(previewDiv).css('top', $(window).height() - 20 - h + $(document).scrollTop());
				}
			},
			enableTarget: function(selector) {
				var maxHeight = $(window).height() - 40;
				var previewDiv = self.features.imagePreviews.wrapper;
				$(selector).each(function() { 
					if($(playVideoIconSelector, $(this).parent()).size() == 0) {	// no preview for videos
						var img = this;
						if($(img).attr('rel') != 'bcGplusTwImgPrvw') {
							$(img).attr('rel', 'bcGplusTwImgPrvw');
							$(img).mouseover(function(e) {
								self.features.imagePreviews.mousePos = e;
								self.features.imagePreviews.reposition();
								currentPreviewTarget = img;
								setTimeout(function() {
									if(currentPreviewTarget) {
										$('.loading', previewDiv).show();
										$('#bcGPTwksPrvImg').hide();
										$(previewDiv).fadeIn('fast');
										var src = currentPreviewTarget.src.replace(/\/w\d+[^\/]+\//, '/w' + previewWidthMax + '/');
										src = src.replace(/\/s\d+[^\/]+\//, '');
										src = src.replace(/\/h\d+[^\/]+\//, '/h' + maxHeight + '/');
										src = src.replace(/sz=\d+/, '');
										src = src.replace(/resize_h=\d+/, '');
										src = src.replace(/&$/, '');
										$('#bcGPTwksPrvImg').load(function() {
											if(currentPreviewTarget) {
												function showImage() {
													$('.loading', previewDiv).hide();
													$('#bcGPTwksPrvImg').show();
													self.features.imagePreviews.reposition();
													self.features.imagePreviews.loaded[src] = true;
												}
												if(typeof(self.features.imagePreviews.loaded[src]) != 'undefined') 
													showImage();
												else 
													setTimeout(showImage, 500);
											}
										});
										$('img', previewDiv).attr('src', src);
									}
								}, parseInt(Config.get('imagePreviews')));
							});
							$(img).mouseout(function() {
								currentPreviewTarget = false;
								$(previewDiv).fadeOut('fast', function() {
									$('#bcGPTwksPrvImg').attr('src', '');
								});
							});
							$(img).mousemove(function(e) {
								self.features.imagePreviews.mousePos = e;
								currentPreviewTarget = this;
								self.features.imagePreviews.reposition(e);
							});
						}
					}
				});
			},
			processPosts: function() {
				self.features.imagePreviews.enableTarget(postMediaSelector);
				self.features.imagePreviews.enableTarget(postAvatarSelector);
				self.features.imagePreviews.enableTarget(myAvatarSelector);
				self.features.imagePreviews.enableTarget(vcardAvatarSelector);
				self.features.imagePreviews.enableTarget(vcardAvatarInCommonSelector);
				self.features.imagePreviews.enableTarget(hangoutNoticeAvatarSelector);
				// notification avatars
				self.features.imagePreviews.enableTarget('.eJn3s.a-b-l-Z-hd-z.IurX4c');
				// main profile pics in left column
				self.features.imagePreviews.enableTarget('.ea-g-Vc-pa-A img.ea-g-Vc-pa');
				// pictures in profile pages
				self.features.imagePreviews.enableTarget('.a-c-hb-Qa img.a-b-c-hb-Qa-pa.a-c-hb-Qa-pa');
			}
		},
		comments: {
			init: function() {
				if(Config.get('comments')) {
					self.addStyle(
							selectors.post + ' .bcGTweaksNumComments { margin-left:.5em; cursor:pointer; }' +
							'.bcGTweaksNumComments:hover { text-decoration:underline; }' +
							selectors.post + ' .a-b-f-i-Xb.a-f-i-Xb { height:0; overflow:hidden; visibility:hidden; }' +
							selectors.post + ' .a-b-f-i-Xb.a-f-i-Xb + div { display:none; }' +
							'.bcGPlusTwCollapseComments { cursor:pointer; height:20px; border:1px solid #ccc; background:#FBFBFB url(https://lh5.googleusercontent.com/-rHmDn0yOCqw/TjxKkh6qsnI/AAAAAAAAAVs/IXdBYIlby2k/bullet-arrow-up-icon.png) center no-repeat; margin-bottom:10px; }' +
							'.bcGPlusTwCollapseComments:hover { background-color:#eee; }'
					);
					self.addPolling(self.features.comments.processPosts);
				}
			},
			processPosts: function() {
				function showComments(_comments) {
					if(parseInt($(_comments).css('height').replace(/[^\d]/g, '')) < 5) {
						$(_comments).css('height', 'auto');
						$(_comments).css('visibility', 'visible');
						
						// only show "add a comment" box at the end of comments if editor not open
						if($('.editable', _comments).size() == 0) {
							$(_comments).next().show();
						}
					}
				}
				function hideComments(_comments) {
					$(_comments).css('height', '0');
					$(_comments).css('overflow', 'hidden');
					$(_comments).css('visibility', 'hidden');
					$(_comments).next().hide();
				}
				$(selectors.post).each(function() {
					var post = this;
					$(selectors.postCommentsWrapper, post).each(function() {
						var _comments = this;
						function getNumComments() {
							var commentsOld = $(selectors.postCommentsOldButton, _comments);
							var numOld = commentsOld.html() ? parseInt(commentsOld.html().replace(/[^\d]/g, '')) : 0;
							var numNew = $(selectors.postComment, _comments).size();
							var commentsMore = $(selectors.postCommentsMoreButton, _comments);
							var numMore = commentsMore.html() ? parseInt(commentsMore.html().replace(/[^\d]/g, '')) : 0;
							return numOld + numNew + numMore;
						}
						numTotal = getNumComments();
						if($('.bcGTweaksNumComments', post).size() == 0) {
							if(numTotal > 0) {
								var commentsButton = document.createElement('span');
								commentsButton.className = 'bcGTweaksNumComments';
								commentsButton.innerHTML = '(' + numTotal + ')';
								var postComment = $(selectors.postCommentButton, $(this).parent().parent());
								postComment.after(commentsButton);
								postComment.click(function() {
									showComments(_comments);
								});
								function toggleComments() {
									if(parseInt($(_comments).css('height').replace(/[^\d]/g, '')) < 5) {
										showComments(_comments);
									} else {
										hideComments(_comments);
									}
								}
								$(commentsButton).click(toggleComments);
								$(_comments).append('<div class="bcGPlusTwCollapseComments" title="Collapse comments">&nbsp;</div>');
								$('.bcGPlusTwCollapseComments', _comments).click(toggleComments);
								hideComments(_comments);
							} else {
								showComments(_comments);
								$(_comments).next().hide();
							}
						} else {
							var oldNum = parseInt($('.bcGTweaksNumComments', post).text().replace(/[^\d]/g, ''));
							if(numTotal != oldNum) {
								$('.bcGTweaksNumComments', post).html('(' + numTotal + ')');
								if(parseInt($(_comments).css('height').replace(/[^\d]/g, '')) < 5) {
									$(_comments).next().hide(); // hide the "add comments" box
								}
							}
						}
					});
					
				});
			}
		},
		mention: {
			init: function() {
				if(Config.get('easyMentions')) {
					self.addStyle(self.selectors.post + ' .bcGTweakEzMntn { cursor:pointer; opacity:0.5; font-size:8px; position:relative; top:-1px; ' +
						'margin:0 5px 0 3px; white-space: nowrap; background-color: rgb(238, 238, 238); border:1px solid rgb(221, 221, 221);' +
						'display: inline-block; padding:0 4px; color: rgb(51, 102, 204); }' +
						self.selectors.post + ' .bcGTweakEzMntn:hover { opacity:1; }' +
						// don't display in shares dropdown
						'.TQ0zYb .bcGTweakEzMntn { display:none !important; }'
					);
					self.addPolling(self.features.mention.processPosts);
				}
			},
			processPosts: function() {
				$(selectors.post + ' ' + profileLinkSelector).each(function() {
					var link = this;
					if(link.rel != 'bcGTweakEzMntn' && $('img', link).size() == 0) {
						link.rel = 'bcGTweakEzMntn';
						var mention = document.createElement('span');
						mention.innerHTML = "+";
						mention.title = "Mention " + link.innerHTML + " in your comment";
						mention.className = 'bcGTweakEzMntn';
						$(mention).click(function() {
							// find post wrapper
							var wrapper = null;
							if($(link).parent().attr('class') == 'a-f-i-go') {	// main post author
								wrapper = $(link).parent().parent().parent().parent().parent();
							} else if($(link).prev().attr('class') == 'proflinkPrefix') {	// mention within comment
								if($(link).parent().parent().attr('class') == 'a-b-f-i-p-R') {
									wrapper = $(link).parent().parent().parent().parent().parent().parent().parent(); // mention in post
								} else {
									wrapper = $(link).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent(); // mention in comment
								}
							} else {	// comment author
								wrapper = $(link).parent().parent().parent().parent().parent().parent().parent().parent();
							}
							var addCommentLink = $('span.d-h.a-b-f-i-W-h[role="button"]', wrapper)[0];
							simulateClick(addCommentLink);
							
							function insertMentionRef(name, id) {
								var editor = $('.v-J-n-m-Gc.editable', wrapper); 
								if(editor.size() > 0) {
									
									if(navigator.userAgent.match(/chrome/i)) {
										var html = ' <span> </span><button contenteditable="false" tabindex="-1" style="white-space: nowrap; background-image: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: rgb(238, 238, 238); border-top-width: 1px; border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; border-top-color: rgb(221, 221, 221); border-right-color: rgb(221, 221, 221); border-bottom-color: rgb(221, 221, 221); border-left-color: rgb(221, 221, 221); border-top-left-radius: 2px 2px; border-top-right-radius: 2px 2px; border-bottom-right-radius: 2px 2px; border-bottom-left-radius: 2px 2px; display: inline-block; font: normal normal normal 13px/1.4 Arial, sans-serif; margin-top: 0px; margin-right: 1px; margin-bottom: 0px; margin-left: 1px; padding-top: 0px; padding-right: 1px; padding-bottom: 0px; padding-left: 1px; vertical-align: baseline; color: rgb(51, 102, 204); background-position: initial initial; background-repeat: initial initial; " class="n-QXyXGe" data-token-entity="@' + id + '" oid="' + id + ' +"><span style="color: rgb(136, 136, 136); ">+</span>' + name + ' </button><span>&nbsp;</span>';
									} else {
										var html = ' <span> </span><input type="button" tabindex="-1" value="+' + name + '" style="white-space: nowrap; background: none repeat scroll 0% 0% rgb(238, 238, 238); border: 1px solid rgb(221, 221, 221); border-radius: 2px 2px 2px 2px; display: inline-block; font: 13px/1.4 Arial,sans-serif; margin: 0pt 1px; padding: 0pt 1px; vertical-align: baseline; color: rgb(51, 102, 204);" class="n-QXyXGe" data-token-entity="@' + id + '" oid="' + id + '"><span>&nbsp;</span>';

									}
									
									editor.attr('tabfocus', '0');
									//editor.focus();

									if($('iframe', editor).size() > 0) {
										editor = $('iframe', editor).contents().find("body");
									}
									
									var existingHtml = editor.html().replace(/^(\n|\s)*<\/*br>(\n|\s)*/, '').replace(/(\n|\s)*<\/*br>(\n|\s)*$/, '');
									editor.html(existingHtml +  html);
									editor.focus();
									editor.attr('');
									setTimeout(function() {
										placeCaretAtEnd( editor[0]);
									}, 100);
								} else {
									setTimeout(function() {
										insertMentionRef(name, id);
									}, 200);
								}
							}
							
							// http://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser
							function placeCaretAtEnd(el) {
							    el.focus();
							    if (typeof window.getSelection != "undefined"
							            && typeof document.createRange != "undefined") {
							        var range = document.createRange();
							        range.selectNodeContents(el);
							        range.collapse(false);
							        var sel = window.getSelection();
							        sel.removeAllRanges();
							        sel.addRange(range);
							    } else if (typeof document.body.createTextRange != "undefined") {
							        var textRange = document.body.createTextRange();
							        textRange.moveToElementText(el);
							        textRange.collapse(false);
							        textRange.select();
							    }
							}
							insertMentionRef(link.innerHTML, $(link).attr('oid'));
						});
						$(link).after(mention);
					}
				});
			}
		},
		muteButton: {
			init: function() {
				if(Config.get('muteButton')) {
					self.addStyle('.bcGTweaksMute { ' +
						'background:url(https://lh3.googleusercontent.com/-lZDyA7RaVHQ/Thw6SRRp-lI/AAAAAAAAAI0/qRIid0xFWJs/sound_mute_desaturated.png) center no-repeat;' +
						'padding:1px 15px; opacity:.5;' +
						'position:absolute; right:50px; top:11px; border:1px solid #aaa; border-radius:2px; }' +
						'.bcGTweaksMute:hover { opacity:1;' +
							'background-image:url(https://lh4.googleusercontent.com/-5NYOXadhJOs/Thw5O1SYBoI/AAAAAAAAAIs/zOvmkFAcrks/ound_mute.png); background-color:#eee;' +
						'}' +
						selectors.incomingPostedByMutePost + ' { display:none; }' + 
						selectors.incomingPostedBy + ' + .bcGTweaksMute { top:26px; }' +
						selectors.incomingPostedByAddToCircles + ' { margin-right:55px; }'
					);
					self.addPolling(self.features.muteButton.processPosts);
				}
			},
			processPosts: function() {
				try {
					$(selectors.postButton).each(function() {
						try {
							if($('.bcGTweaksMute', $(this).parent()).size() == 0) {
								var _this = this;
								setTimeout(function() {
									var m = document.createElement('div');
									m.className = 'bcGTweaksMute';
									m.innerHTML = '&nbsp;';
									m.style.cursor = 'pointer';
									var mb = $(selectors.postMuteButton, $(_this).parent().parent().next())[0];
									if(mb) {
										$(_this).before(m);
										m.title = $(mb).text();
										$(m).click(function() {
											var mb = $(selectors.postMuteButton, $(this).parent().parent().next())[0];
											if(mb) simulateClick(mb);
										});
									}
								}, 500);
							}
						} catch(e) { console.log(e); }
					});
				} catch(e) {
					console.log(e);
				}
			}
		},
		muteNotices: {
			init: function() {
				switch(Config.get('muteNotices')) {
					case 'fade':
						self.addPolling(self.features.muteNotices.fadeNewNotices);
						break;
					case 'hide':
						self.addStyle(selectors.muteNotice + ' { display:none !important; }');
						break;
				}
			},
			fadeNewNotices: function() {
				$(selectors.muteNotice).each(function() {
					var _this = this;
					setTimeout(function() {
						$(_this).fadeOut(1000, function() {
							$(this).remove();
						});
					}, 3000);
				});
			}
		},
		thumbnailsOnly: {
			init: function() {
				if(Config.get('thumbsOnly')) self.addPolling(self.features.thumbnailsOnly.processThumbs);
			},
			processThumbs: function() {
				var maxHeight = 46;
				var maxWidth = 62;
				$(postMediaSelector).each(function() {
					if($(this).height() > maxHeight && $(this).width() > maxHeight) {
						var parentWrapper = $(this).parent();
						function shrinkParentWrapper() {
							parentWrapper.height(maxHeight);		// reduce height of container
							parentWrapper.width(maxWidth);		// reduce width of container
						}
						if(this.src.match(/(jpg|jpeg|png|gif)$/i)) {
							var file = this.src.match(/[^\/]+$/)[0];	
							var newSrc = this.src.replace(/[^\/]+\/[^\/]+$/, '') + 'w' + maxWidth + '-h' + maxHeight + '-p/' + file;
							this.src = newSrc;
							parentWrapper.next().remove();		// remove next <br>
							shrinkParentWrapper();
							var nextWrapper = $(this).parent().next();
							if($('img', nextWrapper).size() > 0) {
								nextWrapper.before($(this).parent());
								$(this).parent().attr('class',  nextWrapper.attr('class')); // get the class of the first thumbnail in the row
							}
						} else if($(playVideoIconSelector, parentWrapper).size() == 0) {
							$(this).css('max-height', maxHeight);
							$(this).css('max-width', maxWidth);
							shrinkParentWrapper();
						}
					}
				});
			}
		}
	};
	this.construct = function() {
		Config.scriptName = 'Google+ Tweaks';
		Config.options = this.options;
		self.initFeatures();
		self.applyStyle();
		self.startPolling();
		self.insertOptionsLink();
		return true;
	};
	this.addPolling = function(fnct) {
		self.pollFuncions.push(fnct);
	};
	this.addStyle = function(code) {
 		self.css += code;
 	};
 	this.applyStyle = function() {
 		// implement CSS
		if(self.css != '') {
			if(typeof(GM_addStyle) == 'function') {
				GM_addStyle(self.css);
			} else {
				var sheet = document.createElement('style') ;
				sheet.innerHTML = self.css;
				document.body.appendChild(sheet);
			}
		}
 	};
	this.initFeatures = function() {
		for(var ftr in self.features) {
			if(typeof(self.features[ftr].init) == 'function') self.features[ftr].init();
		}
	};
	this.insertOptionsLink = function() {
 		$('a[href*="preferences"].gbgt + div ol.gbmcc li:eq(1)').after(
 				'<li class="gbkc gbmtc"><a class="gbmt" href="javascript:void(0)" id="bcGTweaksOptLnk">Google+ tweaks</a></li>'
 		);
 		$('#bcGTweaksOptLnk').click(function() {
 			Config.open();
 		});
 	}; 	
 	this.startPolling = function() {
 		for(var i = 0; i < self.pollFuncions.length; i++) {
 			self.pollFuncions[i]();
 		}
 		setTimeout(self.startPolling, self.pollInterval);
 	};
	return this.construct();
}

// much of the code for this section originated at http://userscripts.org/scripts/show/24430
// and is used here in a modified form with Peter Wooley's consent
function FavIcon(gPlusIcon) {
	var self = this;
	this.self = this;
	this.src = gPlusIcon;
	this.foreground = "#2c3323";
	this.background = "#fef4ac";
	this.borderColor = "#fef4ac";
	this.construct = function() {				
		this.head = document.getElementsByTagName('head')[0];
		this.pixelMaps = {
			numbers: [
				[
					[0,1,1,0],
					[1,0,0,1],
					[1,0,0,1],
					[1,0,0,1],
					[0,1,1,0]
				],
				[
					[0,1,0],
					[1,1,0],
					[0,1,0],
					[0,1,0],
					[1,1,1]
				],
				[
					[1,1,1,0],
					[0,0,0,1],
					[0,1,1,0],
					[1,0,0,0],
					[1,1,1,1]
				],
				[
					[1,1,1,0],
					[0,0,0,1],
					[0,1,1,0],
					[0,0,0,1],
					[1,1,1,0]
				],
				[
					[0,0,1,0],
					[0,1,1,0],
					[1,0,1,0],
					[1,1,1,1],
					[0,0,1,0]
				],
				[
					[1,1,1,1],
					[1,0,0,0],
					[1,1,1,0],
					[0,0,0,1],
					[1,1,1,0]
				],
				[
					[0,1,1,0],
					[1,0,0,0],
					[1,1,1,0],
					[1,0,0,1],
					[0,1,1,0]
				],
				[
					[1,1,1,1],
					[0,0,0,1],
					[0,0,1,0],
					[0,1,0,0],
					[0,1,0,0]
				],
				[
					[0,1,1,0],
					[1,0,0,1],
					[0,1,1,0],
					[1,0,0,1],
					[0,1,1,0]
				],
				[
					[0,1,1,0],
					[1,0,0,1],
					[0,1,1,1],
					[0,0,0,1],
					[0,1,1,0]
				],
			]
		};
		return true;
	};
	this.getIconCanvas = function(callback) {
		if(!self.iconCanvas) {
			self.iconCanvas = document.createElement('canvas');
			self.iconCanvas.height = self.iconCanvas.width = 16;
			
			var image = new Image();
			$(image).load(function() {
				// fill the canvas with the background favicon's data
				var ctx = self.iconCanvas.getContext('2d');
				ctx.drawImage(image, 0, 2, 14, 14);
				callback(self.iconCanvas);
			});
			image.src = self.src;
		} else {
			callback(self.iconCanvas);
		}
	};
	this.getBadgedIcon = function(unread, callback) {
		if(!self.textedCanvas) {
			self.textedCanvas = [];
		}
		if(!self.textedCanvas[unread]) {
			
			self.getIconCanvas(function(iconCanvas) {
				
				var textedCanvas = document.createElement('canvas');
				textedCanvas.height = textedCanvas.width = iconCanvas.width;
				var ctx = textedCanvas.getContext('2d');
				ctx.drawImage(iconCanvas, 0, 0);
				
				ctx.fillStyle = self.background;
				ctx.strokeStyle = self.border ? self.border : '#000000';
				ctx.strokeWidth = 1;
				
				var count = unread.length;
				var bgHeight = self.pixelMaps.numbers[0].length;
				var bgWidth = 0;
				var padding = count > 2 ? 0 : 1;
				
				for(var index = 0; index < count; index++) {
					bgWidth += self.pixelMaps.numbers[unread[index]][0].length;
					if(index < count-1) {
						bgWidth += padding;
					}
				}
				bgWidth = bgWidth > textedCanvas.width-4 ? textedCanvas.width-4 : bgWidth;
				
				ctx.fillRect(textedCanvas.width-bgWidth-4,1,bgWidth+4,bgHeight+4);
				
				var digit;
				var digitsWidth = bgWidth;
				for(var index = 0; index < count; index++) {
					digit = unread[index];
					if (self.pixelMaps.numbers[digit]) {
						var map = self.pixelMaps.numbers[digit];
						var height = map.length;
						var width = map[0].length;
						
						ctx.fillStyle = self.foreground;
						
						for (var y = 0; y < height; y++) {
							for (var x = 0; x < width; x++) {
								if(map[y][x]) {
									ctx.fillRect(14- digitsWidth + x, y+3, 1, 1);
								}
							}
						}
						
						digitsWidth -= width + padding;
					}
				}	
				if(self.border) {
					ctx.strokeRect(textedCanvas.width-bgWidth-3.5,1.5,bgWidth+3,bgHeight+3);
				}
				self.textedCanvas[unread] = textedCanvas;
				callback(self.textedCanvas[unread].toDataURL('image/png'));
			});
		} else {
			callback(self.textedCanvas[unread].toDataURL('image/png'));
		}
	};
	this.setIcon = function(icon) {
		var links = self.head.getElementsByTagName("link");
		for (var i = 0; i < links.length; i++)
			if ((links[i].rel == "shortcut icon" || links[i].rel=="icon") &&
			   links[i].href != icon)
				self.head.removeChild(links[i]);
			else if(links[i].href == icon)
				return;

		var newIcon = document.createElement("link");
		newIcon.type = "image/png";
		newIcon.rel = "shortcut icon";
		newIcon.href = icon;
		
		self.head.appendChild(newIcon);
		
		var shim = document.createElement('iframe');
		shim.width = shim.height = 0;
		document.body.appendChild(shim);
		shim.src = "icon";
		document.body.removeChild(shim);
	};
	this.set = function(num) {
		if(typeof(num) == 'undefined' || (!num && num.toString() != '0')) num = '';
		if(num != '') {
			self.getBadgedIcon(num.toString(), function(src) {
				self.setIcon(src);
			});
		} else {
			self.setIcon(this.src);
		}
	};
	this.toString = function() { return '[object FavIconAlerts]'; };
	
	return this.construct();
}

function simulateClick(element) {
    var clickEvent;
    clickEvent = document.createEvent("MouseEvents")
    clickEvent.initEvent("mousedown", true, true)
    element.dispatchEvent(clickEvent);
    
    clickEvent = document.createEvent("MouseEvents")
    clickEvent.initEvent("click", true, true)
    element.dispatchEvent(clickEvent);
    
    clickEvent = document.createEvent("MouseEvents")
    clickEvent.initEvent("mouseup", true, true)
    element.dispatchEvent(clickEvent);
}

if(!document.location.toString().match(/frame/)) {

	var css = '';
	
	
	
//	if(Config.get('postButtons')) stylePostButtons();
	
	
	
	
	if(Config.get('hideIncomingNotice')) css += selectors.incomingNotice + ' { display:none; }';
	if(Config.get('hideWelcomeLink')) css += selectors.welcomeLink + ', ' + selectors.welcomeLink + ' + div { display:none; }';
	if(Config.get('hideChatRoster')) css += selectors.chatRoster + ' { display:none !important; }';
	if(Config.get('hideSendFeedback')) css += selectors.sendFeedback + ' { display:none !important; }';
	if(Config.get('hidePlusMention')) css += '.proflinkPrefix { display:none !important; }';
	
	// right column
	if(Config.get('hideRightCol')) css += rightColSelector + ' { display:none; }';
	if(Config.get('hideSuggestions')) css += selectors.streamRightColSuggestions + ' { display:none; }';
	if(Config.get('hideGoMobile')) css += rightColSelector + ' .a-kh-Ae div:first-child + div + div + div { display:none; }';
	if(Config.get('hideSendInvites')) css += rightColSelector + ' .a-kh-Ae div:first-child + div + div + div + div { display:none; }';
	
	
	// implement CSS
	if(css != '') {
		if(typeof(GM_addStyle) == 'function') {
			GM_addStyle(css);
		} else {
			var sheet = document.createElement('style') ;
			sheet.innerHTML = css;
			document.body.appendChild(sheet);
		}
	}
}

new GTweaks();