angular
    .module('app', [])
    .controller('AppController', function ($scope, $location) {
        let baseUrl = $location.absUrl().concat('rest/v1/message');
        $scope.tasks = []
        $scope.message_id = '12345'
        $scope.stompClient = {};

        initEventSource()

        $scope.sendMessage = function () {
            console.log(baseUrl)
            console.log("message_id: " + $scope.message_id)
            console.log("message_from: " + $scope.message_from)
            console.log("message_to: " + $scope.message_to)
            console.log("message_text: " + $scope.message_text)

            let messageRequest = {
                "id": $scope.message_id,
                "from": $scope.message_from,
                "to": $scope.message_to,
                "text": $scope.message_text,
                "status": 'CREATED'
            };

            $scope.stompClient.send("/app/send",
                {},
                JSON.stringify({'username': $scope.message_from, 'text': $scope.message_text}
                ));
        };

        function initEventSource() {
            let socket = new SockJS('/app-cms-websocket');
            $scope.stompClient = Stomp.over(socket);
            $scope.stompClient.connect({},
                function (frame) {
                    console.log('Connected: ' + frame);
                    $scope.stompClient.subscribe('/topic/message', function (greeting) {
                        console.log(">>>>>" + JSON.parse(greeting.body))
                        $scope.message_text = ''
                        $scope.$apply(function () {
                            if ($scope.tasks.length === 7) {
                                $scope.tasks.shift();
                            }
                            $scope.tasks.push(JSON.parse(greeting.body));
                        });
                    });
                });
        }
    });