// here we imitate loading data
const loadData = async () => {
    // waiting one second
    // eslint-disable-next-line promise/param-names
    await new Promise(r => setTimeout(r, 1000));

    // return data
    const data = 'this is loaded data';
    return data;
};
export default loadData;
