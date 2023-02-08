(function() {
	window.show = function(data) {
		if (data.characters) {
			$(".container").show();

			for(let char of data.characters) {
				$('.char-item-list').append(`
					<div class="char-item">
						<div class="char-data">
							<div class="char-data-line">
								<div>Name</div>
								<div class="charname">${char.name}</div>
							</div>
							<div class="char-data-line">
								<div>Birth Date</div>
								<div class="chardob">${char.birthdate}</div>
							</div>
						</div>
						
						<button class="btn btn-pickchar" data-char-id="${char.id}">
							Select
						</button>
					</div>
				`);
			}
		}
		
		$(".container").show();
		$(".welcomescreen").show();
	};

	$("#birthday").birthdayPicker({
		maxAge: 90,
		minAge: 6,    
	}); 
		
	window.hide = function() {
		$(".welcomescreen").hide();
	};
	window.startCreateNewCharacter = function(data) {
		$(".create-char-info").show();
	};
	
	let sex = null;
	window.onload = function(e) {
		window.addEventListener("message", function(event) {
			if (window[event.data.type]) {
				window[event.data.type](event.data);
			} else {
				console.log("Unsupported type: " + event.data.type);
			}
		});
	};

	$('body').on('click', '.btn-pickchar', function() {
		let charId = $(this).data('char-id');

		$.post("http://ref_charsetup/selectCharacter", JSON.stringify({
			id: charId
		}));
	});
	
	$("#createchar-btn").click(function() {
		$("#createchar-btn").hide();
		$.post("http://ref_charsetup/startCreateNewCharacter", JSON.stringify({}));
	});
	
	$(".picksex-btn").click(function() {
		sex = $(this).data("sex");
		
		$(".picksex-btn").removeClass('selected');
		$(this).addClass('selected');
	});

	$("#finish-create-char").click(function() {
		let firstname = $("#name-firstname").val();
		let lastname = $("#name-lastname").val();
		let dobMonth = $('select[name="birthday_birth[month]"] option:selected').val();
		let dobDay = $('select[name="birthday_birth[day]"] option:selected').val();
		let dobYear = $('select[name="birthday_birth[year]"] option:selected').val();

		if(sex == null) {
			$(".error").text("Gender must be selected!");
			$(".error").show();
			return
		}

		if(firstname == '') {
			$(".error").text("Firstname must not be empty!");
			$(".error").show();
			return
		}
		if(firstname.charAt(0) !== firstname.charAt(0).toUpperCase()) {
			$(".error").text("Firstname must start with a capital letter!");
			$(".error").show();
			return
		}
		
		if(lastname == '') {
			$(".error").text("Lastname must not be empty!");
			$(".error").show();
			return
		}
		if(lastname.charAt(0) !== lastname.charAt(0).toUpperCase()) {
			$(".error").text("Lastname must start with a capital letter!");
			$(".error").show();
			return
		}

		if(dobMonth == 0 || dobDay == 0 || dobYear == 0) {
			$(".error").text("Birth Date must be selected!");
			$(".error").show();
			return
		}
		$(".error").hide();

		$.post("http://ref_charsetup/createNewCharacter", JSON.stringify({
			sex: sex,
			firstname: firstname,
			lastname: lastname,
			dob: dobYear + '-' + dobMonth + '-' + dobDay,
		}));
	});
})();
	