<script>
    // @ts-nocheck

	import { onMount, onDestroy } from 'svelte';

    // Import Environment variables from .env file
    import { env } from "$env/dynamic/public";

    // Import pocketbase
    import PocketBase from "pocketbase";

    const pb = new PocketBase("http://127.0.0.1:8090");

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return "" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    onMount(async () => {

		pb.collection('led_requests').subscribe('*', function (e) {
            console.log("Got request!")
            if (e.record["completed"]) { return; }

            const data = { 
                "seg": {
                    "i": [
                        e.record["led_to_update"],
                        rgbToHex(e.record["r"],e.record["g"],e.record["b"])
                    ]
                }
            }

            const updated_record_data = {
                "led_to_update": e.record["let_to_update"],
                "requested_by": e.record["requested_by"],
                "r": e.record["r"],
                "g": e.record["g"],
                "b": e.record["b"],
                "brightness": e.record["brightness"],
                "completed": true
            };
                    
            fetch(env.PUBLIC_tree_url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(async (response) => {
                console.log("Finished request!")
                const record = await pb.collection('led_requests').update(e.record["id"], updated_record_data);
            });

        }).catch((err) => {
            console.log(err.originalError);
        })
	});

    onDestroy(() => pb.collection('led_requests').unsubscribe());

</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>


<style>

</style>