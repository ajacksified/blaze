﻿function ChatView() {
    this.visibleRoom = null;
    this.roomsModel = null;
}

ChatView.prototype.init = function (roomsModel) {
    var self = this;
    self.roomsModel = roomsModel;
    ko.applyBindings(self.roomsModel, document.getElementById('lobby'));
    ko.applyBindings(self.roomsModel, document.getElementById('tabs'));

    $('.tabs').bind('change', function (e) {
        var domId = $(e.target).attr('href');
        if (domId === '#lobby') return;
        self.changeRoom(domId);
    });
    $('.input-message').live('keydown', function (e) {
        if (e.keyCode === 13) {
            if(!e.ctrlKey) {
                $(this).parent().find('button').click();
                return false;
            } else {
                $(this).insertAtCaret('\n');
            }
        }
    });
};

ChatView.prototype.addRoom = function(roomModel) {
    var self = this;
    self.roomsModel.rooms.push(roomModel);
    self.roomsModel.roomsByDomId[roomModel.domId()] = roomModel;
};

ChatView.prototype.changeRoom = function (roomId) {
    var self = this;
    if (self.visibleRoom != null) self.visibleRoom.isVisible(false);
    self.roomsModel.roomsByDomId[roomId].isVisible(true);
    self.scrollToEnd();
};

ChatView.prototype.show = function () {
    $('.header-wrap').show();
    $('#ie6-container-wrap').show();
};

ChatView.prototype.showRoom = function(room) {
    if ($(room.domId()).length == 0) {
        var roomDom = $('#room').clone();
        roomDom.attr('id', 'room-' + room.id());
        $('#room').parent().append(roomDom);

        $(roomDom).each(function(i, r) {
            ko.applyBindings(room, r);
        });
    }
};

ChatView.prototype.sortRooms = function() {
    this.roomsModel.rooms.sort(function(l, r) {
        if (l.users().length == r.users().length) return 0;
        if (l.users().length < r.users().length) return 1;
        return -1;
    });
};

ChatView.prototype.scrollToEnd = function () {
    $(document).scrollTo('max');
};
