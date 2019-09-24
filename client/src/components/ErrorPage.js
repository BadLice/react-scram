import React from 'react';
import '../style/Error.css';


function ErrorPage(props) {
	return(
		<div id="notfound">
			<div className="notfound">
				<div className="notfound-404">
					<h1>Oops!</h1>
					<h2>An error occured<br/>(Your session could be expired)</h2>
				</div>
				<a href="../login/" className="w3-btn w3-pink">Go To LogIn</a>
			</div>
		</div>
	);
}

export default ErrorPage;
