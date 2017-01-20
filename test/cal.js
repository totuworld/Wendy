'use strict'

function CalProduct(P, Q, targetArr) {
    P = P*1;
    Q = Q*1;
    let cal = 1;

    if(P === Q) {
        cal *= targetArr[P];
        cal *= targetArr[P];
        return cal;
    }

    cal *= targetArr[P];
    while(P+1 !== Q) {
        P += 1;
        cal *= targetArr[P];
        if(P>100) process.exit();
    }

    cal *= targetArr[Q];
    while(Q-1 !== P) {
        Q -= 1;
        cal *= targetArr[Q];
        if(Q>100) process.exit();
    }

    return cal;
}

function GetSplitArr(targetArr) {
    let splitArr = [];
    for (let i=0;i<targetArr.length-1;++i) {
        if(targetArr[i+1]-targetArr[i] > 1)
            splitArr.push({arrLength:targetArr[i+1]-targetArr[i], startIndex:targetArr[i], endIndex:targetArr[i+1]});
    }
    return splitArr;
}

function solution(A) {
    //1. 0과 Math.abs(x)<0인 인덱스를 모두 구한다.
    //2. 그중 0인 인덱스를 빼고 나머지 구간을 잡는다.
    //3. 각 구간 중에 Math.abs(x)가 1보다 작은 인덱스를 뽑아낸다.
    //4. 해당 구간에서 0보다 작은 숫자가 짝수개 만큼 있는 곳이나 아주 음수가 없는 곳을 고른다.
    //5. 4가 n개 존재하면 그 중 가장 length가 긴놈을 선택한다.
    //6. length가 같은 놈이 m개라면 이건 직접 돌려서 더 큰놈을 선택한다.

    //7. 4가 1개도 존재하지 않으면 

    let zeroIndexArr = [];
    let absSmallIndexArr = [];
    let mixArr = [0, A.length-1];

    for(let index in A) {
        if(A[index] === 0) {
            zeroIndexArr.push(index*1);
            mixArr.push(index*1);
        }
        else if(Math.abs(A[index]) < 0) {
            absSmallIndexArr.push(index*1);
            mixArr.push(index*1);
        }
    }

    mixArr
    .sort((a,b)=>{return a-b;})
    .reduce((a,b)=>{
        if (a.slice(-1)[0] !== b) a.push(b);
        return a;
    },[]);

    let splitArr = GetSplitArr(mixArr);

    if(splitArr.length === 0) {
        let tempZeroIndexArr = zeroIndexArr.slice();
        tempZeroIndexArr.push(0);
        tempZeroIndexArr.push(A.length-1);
        splitArr = GetSplitArr(tempZeroIndexArr);
    }

    if(splitArr.length === 0) {
        splitArr = GetSplitArr([0, A.length-1]);
    }

    splitArr.sort((a,b)=>{
        return b.arrLength - a.arrLength;
    })

    let totalHigher = {splitArrIndex:null, totalMax:-1};

    for(let row in splitArr) {
        let totalMax = 0;
        for(let i=splitArr[row].startIndex;i<splitArr[row].endIndex;++i) {
            totalMax += Math.abs(A[i]);
        }
        if(totalMax>totalHigher.totalMax) {
            totalHigher.splitArrIndex = row;
            totalHigher.totalMax = totalMax;
        }
    }

    let returnValue = 0;

    for(let l=splitArr[totalHigher.splitArrIndex].startIndex;l<=splitArr[totalHigher.splitArrIndex].endIndex;++l) {
        for(let m=l;m<=splitArr[totalHigher.splitArrIndex].endIndex;++m) {
            let tempValue = CalProduct(l, m, A);
            if(tempValue>returnValue) returnValue = tempValue;
        }
    }

    return returnValue;
}

let arr = [1.0, 0.1, -1.0, -7.0, 3.0, -5.0, -2.5, 0.0, 1.0];
console.log(solution([1.0, 0.1, -1.0, -7.0, 3.0, -5.0, -2.5, 0.0, 1.0]));