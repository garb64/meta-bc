metaBc.controller('logController', function($scope, ngToast, logService) {

    var log = [ ];

    $scope.logGrid = {
        data: log,
        columnDefs: [
            {
                field: 'timeStamp',
                displayName: "Date",
                width: 200
            },
            {
                field: 'severity',
                displayName: "Level",
                width: 80
            },
            {
                field: 'message',
                displayName: "Message"
            }
        ]
    };

    $scope.$on('LogEvent', function(event, res) {
        log.push(res);
    });
});
