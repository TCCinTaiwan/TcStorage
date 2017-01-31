define(
    "ace/ext/hoverlink",
    ["require", "exports", "module", "ace/lib/oop", "ace/lib/event", "ace/range", "ace/lib/event_emitter", "ace/editor", "ace/config"],
    function(require, exports, module) {
        "use strict";
        var Editor = require("ace/editor").Editor;

        require("../config").defineOptions(Editor.prototype, "editor", {
            enableHoverLink: {
                set: function(val) {
                    // this[val ? "on" : "off"]("click", onClick);
                    if (val) {
                        new HoverLink(this);
                    } else {
                        this.hoverLink = null;
                    }
                },
                value: true
            }
        });
        var oop = require("ace/lib/oop");
        var event = require("ace/lib/event");
        var Range = require("ace/range").Range;
        var EventEmitter = require("ace/lib/event_emitter").EventEmitter;
        var HoverLink = function(editor) {
            if (editor.hoverLink)
                return;
            editor.hoverLink = this;
            this.editor = editor;
            this.update = this.update.bind(this);
            this.onMouseUp = this.onMouseUp.bind(this);
            this.onMouseMove = this.onMouseMove.bind(this);
            this.onMouseOut = this.onMouseOut.bind(this);
            this.onClick = this.onClick.bind(this);
            this.onDBClick = this.onDBClick.bind(this);
            event.addListener(editor.renderer.scroller, "mouseup", this.onMouseUp);
            event.addListener(editor.renderer.scroller, "mousemove", this.onMouseMove);
            event.addListener(editor.renderer.content, "mouseout", this.onMouseOut);
            event.addListener(editor.renderer.content, "click", this.onClick);
            event.addListener(editor.renderer.content, "dblclick", this.onDBClick);
        };


        (function(){
            oop.implement(this, EventEmitter);

            this.token = {};
            this.range = new Range();

            this.update = function() {
                this.$timer = null;
                var renderer = this.editor.renderer;

                var canvasPos = renderer.scroller.getBoundingClientRect();
                var offset = (this.x + renderer.scrollLeft - canvasPos.left - renderer.$padding) / renderer.characterWidth;
                var row = Math.floor((this.y + renderer.scrollTop - canvasPos.top) / renderer.lineHeight);
                var col = Math.round(offset);

                var screenPos = {row: row, column: col, side: offset - col > 0 ? 1 : -1};
                var session = this.editor.session;
                var docPos = session.screenToDocumentPosition(screenPos.row, screenPos.column);

                var selectionRange = this.editor.selection.getRange();
                if (!selectionRange.isEmpty()) {
                    if (selectionRange.start.row <= row && selectionRange.end.row >= row)
                        return this.clear();
                }

                var line = this.editor.session.getLine(docPos.row);
                if (docPos.column == line.length) {
                    var clippedPos = this.editor.session.documentToScreenPosition(docPos.row, docPos.column);
                    if (clippedPos.column != screenPos.column) {
                        return this.clear();
                    }
                }
                var token = session.getTokenAt(docPos.row, docPos.column);
                if (token) {
                    token = this.getUrlToken(token);
                }
                this.link = token;
                if (!token) {
                    return this.clear();
                }
                this.isOpen = true
                this.editor.renderer.setCursorStyle("pointer");

                session.removeMarker(this.marker);
                this.range =  new Range(docPos.row, token.start, docPos.row, token.start + token.value.length);
                this.marker = session.addMarker(this.range, "ace_link_marker", "text", true);
            };

            this.clear = function() {
                if (this.isOpen) {
                    this.link = null;
                    this.editor.session.removeMarker(this.marker);
                    this.editor.renderer.setCursorStyle("");
                    this.isOpen = false;
                }
            };

            // this.getMatchAround = function(regExp, string, col) {
            //     var match;
            //     regExp.lastIndex = 0;
            //     string.replace(regExp, function(str) {
            //         var offset = arguments[arguments.length-2];
            //         var length = str.length;
            //         if (offset <= col && offset + length >= col)
            //             match = {
            //                 start: offset,
            //                 value: str
            //             };
            //     });
            //     return match;
            // };
            this.getUrlToken = function(token) {
                var text = token.value;
                text = text.replace(/^["'`]|["'`]$/g, '').replace(/^[ ]*|[ ]*$/g, '');
                var match = text.match(/^(?:(?:(?:https?|ftp):|\.{0,2}\/)[\S ]+)$/g, "i");
                if (match) {
                    var temp;
                    return {
                        start: token.start + ((temp = token.value.indexOf(text)) > 0 ? temp : 0),
                        value: text
                    };
                }
                match = text.match(/^(?:[\S ]+\.|#)[\S ]+$/g, "i");
                if (match) {
                    var xhr = new XMLHttpRequest(); // new ActiveXObject("Microsoft.XMLHTTP")
                    xhr.open('GET', text, false);
                    xhr.send();
                    if (xhr.status === 200) {
                        var temp;
                        return {
                            start: token.start + ((temp = token.value.indexOf(text)) > 0 ? temp : 0),
                            value: text
                        };
                    }
                }
                return;
            };

            this.onClick = function(evt) {
            };

            this.onMouseUp = function(evt) {
                if (evt.button == 1) {
                    if (this.link) {
                        window.open(this.link.value, "_blank");
                        this.clear()
                    }
                }
            };
            this.onDBClick = function() {

            }

            this.onMouseMove = function(e) {
                if (this.editor.$mouseHandler.isMousePressed) {
                    if (!this.editor.selection.isEmpty())
                        this.clear();
                    return;
                }
                this.x = e.clientX;
                this.y = e.clientY;
                this.update();
            };

            this.onMouseOut = function(e) {
                this.clear();
            };

            this.destroy = function() {
                this.onMouseOut();
                event.removeListener(this.editor.renderer.scroller, "mousemove", this.onMouseMove);
                event.removeListener(this.editor.renderer.content, "mouseout", this.onMouseOut);
                delete this.editor.hoverLink;
            };

        }).call(HoverLink.prototype);

    }
);
(function() {
    window.require(["ace/ext/hoverlink"], function() {});
})();