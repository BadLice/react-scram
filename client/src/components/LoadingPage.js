import React from 'react';
import '../style/LoadingPage.css';


function LoadingPage(props) {
	return(
		<div className="loader">
			<div className="ball1"></div>
			<div className="ball2"></div>
			<div className="ball3"></div>
		</div>
	);
}

export default LoadingPage;
