let sam = [];
new Promise((res, rej) => {

        res([{ name: 'sam', age: 21 }, { name: 'nat', age: 22 }]);
    })
    .then(res => {
        console.log(res);
        sam = res;
        return res;
    });

setTimeout(() => console.log(sam[0]), 0);