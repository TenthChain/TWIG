
<script>
    // @ts-nocheck
    export let value;
    export let title;
    export let icon;
</script>

<style>
    /* your styles go here */
</style>

<div class="card">
    <div class="card-body">
        <p class="mb-0">{title}</p>
        {#if (value && value != 0)}
        <h2 class="mb-0">{value}</h2>
        {:else if  icon}
        <h2 class="mb-0"><i class="{icon}"></i></h2>
        {:else}
        <h2 class="mb-0">Nothing passed...</h2>
        {/if}
    </div>
</div>