$("#username").val(localStorage.username);

$("#go").click(function() {
	var client_id = "85a4dcf95a634de795516cbc6e7b65ae";

	var username = $("#username").val();
	localStorage.username = username;

	function search(query, callback) {
		$.ajax({
			url: "https://api.instagram.com/v1/users/search",
			dataType: "jsonp",
			data: {
				q: query,
				client_id: client_id
			}
		}).done(function(res) {
			callback(res.data[0].id);
		});
	}

	search(username, function(id) {
		$.ajax({
			url: "https://api.instagram.com/v1/users/" + id + "/media/recent",
			dataType: "jsonp",
			data: {
				client_id: client_id
			}
		}).done(function(res) {
			var words = [];
			var count = 0;

			res.data.forEach(function(photo) {
				photo.comments.data.forEach(function(comment) {
					if(comment.from.username == username) {
						comment.text.split(" ").forEach(function(word) {
							count += 1;

							if(words[word]) {
								words[word][0] += 1;
							} else {
								words[word] = [];
								words[word][0] = 1;
								words[word][1] = word;
							}
						});
					}
				});
			});

			var rank = [];
			console.log(words);

			for(var i = 1; i < count; i++) {
				rank[i] = [];
				words.forEach(function(word) {
					if(word[0] == i) {
						rank[i].push(word[1]);
					}
				});
			}

			console.log(rank);

		});
	});
});	