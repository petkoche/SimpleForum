/* globals $ */
const changeingValue = 1;

$('.set-value-from-cookie').each(function(i, obj) {
    if (document.cookie.match(obj.id) !== null) {
        document.getElementById(obj.id).classList.add('inactive');
    } else {
        document.getElementById(obj.id).classList.remove('inactive');
    }
});

$('.likesLink').on('click', (event) => {
    event.preventDefault(); // Stop the form from causing a page refresh.
    let postId = event.target.id;
    postId = postId.substring(0, postId.length - 1);
    const elemntToChange = 'positive' + postId;
    const targetDiv = document.getElementById(elemntToChange);
    const currentVal = parseFloat(targetDiv.innerHTML);
    $.ajax({
        url: '/vote',
        data: {
            'postId': postId,
            'node': changeingValue,
            'postType': 'l',
        },
        method: 'POST',
    }).then((response) => {
        const positiveLikeId = postId + 'l';
        const negativeLikeId = postId + 'd';
        targetDiv.innerHTML = currentVal + changeingValue;
        const negativeLike = document.getElementById(postId + 'd');
        if (negativeLike.classList.contains('inactive')) {
            negativeLike.classList.remove('inactive');
            deleteCookie(negativeLikeId);
            deleteCookie(positiveLikeId);
        } else {
            event.target.classList.add('inactive');
        }
    }).catch((err) => {
        console.error(err);
    });
});

$('.hatesLink').on('click', (event) => {
    event.preventDefault(); // Stop the form from causing a page refresh.
    let postId = event.target.id;
    postId = postId.substring(0, postId.length - 1);
    const elemntToChange = 'positive' + postId;
    const targetDiv = document.getElementById(elemntToChange);
    const currentVal = parseFloat(targetDiv.innerHTML);
    $.ajax({
        url: '/vote',
        data: {
            'postId': postId,
            'node': -changeingValue,
            'postType': 'd',
        },
        method: 'POST',
    }).then((response) => {
        const positiveLikeId = postId + 'l';
        const negativeLikeId = postId + 'd';
        targetDiv.innerHTML = currentVal - changeingValue;
        const positiveLike = document.getElementById(postId + 'l');
        if (positiveLike.classList.contains('inactive')) {
            positiveLike.classList.remove('inactive');
            deleteCookie(positiveLikeId);
            deleteCookie(negativeLikeId);
        } else {
            event.target.classList.add('inactive');
        }
    }).catch((err) => {
        console.error(err);
    });
});

function deleteCookie(LikeId) {
    document.cookie = LikeId + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
