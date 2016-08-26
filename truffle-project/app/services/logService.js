metaBc.factory('logService', ['$rootScope', function($rootScope) {



    function watchLog() {
        Logger.deployed().LogEvent().watch(function(error, result){
            if (!error){
                var date = new Date(parseInt(result.args.timeStamp.toString(10)) * 1000);
                result.args.timeStamp = date.toISOString();
                $rootScope.$broadcast('LogEvent', result.args);
            }
            else console.log(error);
        });
    }

    watchLog();

    return {
    };

}]);