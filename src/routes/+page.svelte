<script>
	let passwordInput;

	function checkPassword() {
		fetch('/');
	}
</script>

<form style="col-6">
	<form method="POST" action="?/login">
		<label>
			Password
			<input
				type="password"
				class="form-control"
				on:click={checkPassword}
				bind:this={passwordInput}
				name="password"
				placeholder="Password"
			/>
		</label>
		<button class="btn btn-primary">Log in</button>
	</form>
</form>
