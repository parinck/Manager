var Manager = angular.module( 'Manager', [] );

function ManagerOnDuty( $scope ) {
	function getExtensionList() {
		chrome.management.getAll( function ( extensions ) {
			$scope.$apply( function () {
				$scope.extensions = extensions;
			} )
		} )
	};

	$scope.uninstall = function ( extension ) {
		chrome.management.uninstall( extension.id, function () {
			$scope.$apply( function () {
				getExtensionList();
			} )
		} );
	}


	$scope.onOff = function ( extension ) {
		chrome.management.setEnabled( extension.id, !extension.enabled, function () {
			$scope.$apply( function () {
				extension.enabled = !extension.enabled;
			} )
		} );
	}

	getExtensionList();
}
