const formatDate = (date) => {
	date = new Date(date);
	return ('0'+date.getDay()).slice(-2) + '/' + ('0'+(date.getMonth()+1)).slice(-2) + '/' + date.getFullYear();
}

const dragOverSetup = (e) => {
	e.preventDefault();
}

export {formatDate,dragOverSetup};
