<script>
	// @ts-nocheck

	import { onMount, onDestroy } from 'svelte';

	// Import Environment variables from .env file
	import { env } from '$env/dynamic/public';

	// Import pocketbase
	import PocketBase from 'pocketbase';
	import StatsCard from '$lib/components/statsCard.svelte';

	const pb = new PocketBase('http://127.0.0.1:8090');

	let FlushInProgress = false;
	let ProcessorActive = false;
	let requestCount = 0;
	let count = 0;
	let keepProcessing = false;
	let getRequestIntervalDuration = 5;
	let requestsPerInterval = 10;

	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? '0' + hex : hex;
	}

	function rgbToHex(r, g, b) {
		return '' + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}

	async function UpdateRequestCount() {
		requestCount = (await pb.collection('led_requests').getList(1, 1)).totalPages;
	}

	async function startProcessor() {
		ProcessorActive = true;
		try {
			UpdateRequestCount();
			const userData = await pb
				.collection('users')
				.authWithPassword('jamadmin@niraspberryjam.com', '123456890');
			console.log('subscribing');
			console.log('Authstore / login', pb.authStore.isValid);
			// pb.collection('led_requests')
			// 	.subscribe('*', function (e) {
			// 		console.log('Got Request! Woo!');
			// 	})
			// 	.catch((err) => {
			// 		console.log(err.originalError);
			// 		ProcessorActive = false;
			// 	});

			let doRequestInterval = setInterval(async () => {
				if (!keepProcessing) {
					ProcessorActive = false;
					return;
				}
				ProcessorActive = true;

				console.log('doRequestInterval');

				const startingGetRequestIntervalDuration = getRequestIntervalDuration;

				const DurationPerRequest = getRequestIntervalDuration / requestsPerInterval;

				let resultList = await pb.collection('led_requests').getList(1, requestsPerInterval, {
					filter: 'completed=false'
				});

				console.log(resultList);

				let internalInterval = setInterval(async () => {
					console.log('internalInterval');

					if (!keepProcessing) {
						ProcessorActive = false;
						clearInterval(internalInterval);
						resultList = [];
						return;
					}
					ProcessorActive = true;

					if (resultList.items == 0) {
						console.log('Completed list, exiting...');
						clearInterval(internalInterval);
					}

					e = resultList.items[0];
					if (e.record['completed']) {
						return;
					}

					const data = {
						seg: {
							i: [e.record['led_to_update'], rgbToHex(e.record['r'], e.record['g'], e.record['b'])]
						}
					};

					const updated_record_data = {
						led_to_update: e.record['let_to_update'],
						requested_by: e.record['requested_by'],
						r: e.record['r'],
						g: e.record['g'],
						b: e.record['b'],
						brightness: e.record['brightness'],
						completed: true
					};

					fetch(env.PUBLIC_tree_url, {
						method: 'POST',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(data)
					})
						.then((response) => response.json())
						.then(async (response) => {
							console.log('Finished request!');
							const record = await pb
								.collection('led_requests')
								.update(e.record['id'], updated_record_data);
						});
					UpdateRequestCount();
				}, DurationPerRequest * 1000);
			}, getRequestIntervalDuration * 1000);
		} catch (error) {
			console.log('Error with subscription - ', error);
			ProcessorActive = false;
		}
	}

	function endProcessor() {
		//pb.collection('led_requests').unsubscribe();
		ProcessorActive = false;
	}

	onMount(async () => {
		startProcessor();
	});

	onDestroy(() => {
		console.log('Unsubscribing!');
		endProcessor();
	});

	async function ObliterateDB() {
		endProcessor();
		FlushInProgress = true;
		try {
			console.log('Getting requests...');
			const records = await pb.collection('led_requests').getFullList();
			count = 0;
			console.log('Clearing...');

			if (records.length > 1000) {
				console.log('Limiting delete to 1000 to avoid instability!');
			}

			records.forEach((element) => {
				if (count > 1000) {
					return;
				}
				pb.collection('led_requests').delete(element.id);
				count++;
			});
			console.log('Cleared!');
		} catch (error) {
			console.log('Cannot complete deletion of entre LED Requests table - ', error);
		}

		console.log('Flush completed... waiting to clear backlog of requests');
		setTimeout(function () {
			console.log('Restarted processor!');
			startProcessor();
			FlushInProgress = false;
		}, 1500);
	}

	function unsubscribe() {
		pb.collection('led_requests').unsubscribe();
	}
</script>

<div class="row row-cols-1 row-cols-md-3 g-4 pt-3">
	<div class="col">
		<StatsCard title="Current Count of led_requests records" value={requestCount} />
	</div>
	<div class="col">
		{#if ProcessorActive}
			<StatsCard title="Processor Active?" icon="bi bi-check-circle-fill text-success" />
		{:else}
			<StatsCard title="Processor Active?" icon="bi bi-exclamation-octagon-fill text-danger" />
		{/if}
	</div>
	<div class="col">
		<StatsCard title="Count" value={count} />
	</div>
</div>

<hr />

<div class="row">
	<div class="col">
		{#if FlushInProgress}
			<button class="btn btn-danger btn-disabled btn-lg">
				FLUSH DB! <div class="spinner-border" role="status" />
			</button>
		{:else}
			<button class="btn btn-danger btn-lg" on:click={ObliterateDB}> FLUSH DB! </button>
		{/if}
	</div>
	<div class="col">
		<button class="btn btn-danger btn-lg" on:click={unsubscribe}> Unsubscribe </button>
	</div>
	<div class="col">
		<div class="form-check">
			<input
				class="form-check-input"
				type="checkbox"
				bind:checked={keepProcessing}
				id="flexCheckDefault"
			/>
			<label class="form-check-label" for="flexCheckDefault"> Continue processing? </label>
		</div>
	</div>
	<div class="col">
		<label for="exampleFormControlInput1" class="form-label">GET interval</label>
		<input
			bind:value={getRequestIntervalDuration}
			type="number"
			class="form-control"
			id="exampleFormControlInput1"
			min="0.1"
			step="0.1"
			max="100"
		/>
	</div>
	<div class="col">
		<label for="exampleFormControlInput2" class="form-label">Requests Per Interval</label>
		<input
			type="number"
			bind:value={requestsPerInterval}
			class="form-control"
			id="exampleFormControlInput2"
			min="1"
			step="1"
			max="100"
		/>
	</div>
</div>

<style>
</style>
