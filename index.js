#!/usr/bin/env node

const { program } = require('@caporal/core');
const store = require('store2');

// make 'orders' array and store it in localStorage:
const list = [
  { id: 'no1', orderName: 'Pizza Margherita', size: 'sm' },
  { id: 'no2', orderName: 'Pizza Napoletana', size: 'med' },
];

// keep the orders in localStorage even after the app is closed:
if (!store.get('orders')) {
  process.on('exit', () => store.set('orders', list));
} else {
  list.push(...store.get('orders'));
}

// A CLI pizza order application:
program
  // arguments definition, that will be available in the command from user
  // order pizza:
  .command('order', 'Order a pizza')
  .argument('<type>', 'Pizza type')
  .option('-s, --size <size>', 'Pizza size')
  // action is a function that will be executed when the command is run
  .action(({ logger, args, options }) => {
    // get the list, generate a new id, and add the new order to the list:
    const orderId = `no${list.length + 1}`;
    const newOrder = { id: orderId, orderName: args.type, size: options.size };

    // add the new order to the orders array in localStorage:
    list.push(newOrder);
    store.set('orders', list);

    // print the order:
    logger.info(
      `\n👍 Order ${orderId}: ${args.type} (${options.size}) has been sent\n\n` +
        `🍕 Your orders list:\n${list
          .map(order => `🔸 ${order.id}: ${order.orderName} (${order.size})`)
          .join('\n')}`
    );
  })

  // cancel pizza:
  .command('cancel', 'cancel ordered Pizza')
  .argument('<orderId>', 'Pizza order id')
  // action is a function that will be executed when the command is run
  .action(({ logger, args }) => {
    // get the list, and remove the order from the list:
    const orderId = args.orderId;
    const newList = list.filter(order => order.id !== orderId);

    // update the orders array in localStorage:
    store.set('orders', newList);

    // print the order:
    logger.info(
      `\n👍 Order ${orderId} has been canceled\n\n` +
        `🍕 Your orders list:\n${newList
          .map(order => `🔸 ${order.id}: ${order.orderName} (${order.size})`)
          .join('\n')}`
    );
  });
program.run();
