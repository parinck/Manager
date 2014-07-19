var Manager = angular.module( 'Manager', [] );

function ManagerOnDuty( $scope ) {

	if ( localStorage.getItem( 'mode' ) == 1 ) {
		$scope.mode = "GOD";
	} else {
		$scope.mode = "";
	}

	$scope.$watch( 'mode', function () {
		if ( $scope.mode === "GOD" ) {
			chrome.browserAction.setBadgeText( {
				text: "G"
			} );
			chrome.browserAction.setBadgeBackgroundColor( {
				color: "#ff9900"
			} )
		} else {
			chrome.browserAction.setBadgeText( {
				text: ""
			} );
		}
	} )

	function getExtensionList() {
		chrome.management.getAll( function ( extensions ) {
			$scope.$apply( function () {
				$scope.extensions = extensions;
			} )
		} )
	};

	$scope.godMode = function () {
		$scope.mode = "GOD";
		localStorage.setItem( 'extensions', JSON.stringify( $scope.extensions ) );
		localStorage.setItem( 'mode', 1 );
		for ( var i = $scope.extensions.length - 1; i >= 0; i-- ) {
			ext = $scope.extensions[ i ];
			if ( ext.name === "Manager" ) {
				ext.enabled = false;
			} else {
				ext.enabled = true;
			}
			$scope.onOff( ext );
		};
	};

	$scope.normalMode = function () {
		$scope.mode = "";
		localStorage.setItem( 'mode', 0 );
		$scope.extensions = JSON.parse( localStorage.getItem( 'extensions' ) );
		var ext;
		for ( var i = $scope.extensions.length - 1; i >= 0; i-- ) {
			ext = $scope.extensions[ i ];
			ext.enabled = !ext.enabled;
			$scope.onOff( ext );
		};
	};

	$scope.getPersmissionList = function ( extension ) {
		var permissions = extension.permissions;
		if ( permissions.length ) {
			return extension.permissions.join( " , " )
		} else {
			return "Nothing...:)";
		}
	};

	$scope.uninstall = function ( extension ) {
		chrome.management.uninstall( extension.id, function () {
			$scope.$apply( function () {
				getExtensionList();
			} )
		} );
	};


	$scope.onOff = function ( extension ) {
		chrome.management.setEnabled( extension.id, !extension.enabled, function () {
			$scope.$apply( function () {
				extension.enabled = !extension.enabled;
			} )
		} );
	};

	getExtensionList();
	document.getElementById( 'search' )
		.focus();
}
