//EventEmitter sınıfını getir
const EventEmitter = require('events');

//EventEmitter sınıfının bir örneğini oluştur
const myEmitter = new EventEmitter();
/*
myEmitter nesnesi üzerinden on() emit() gibi metotları artık kullanabiliriz.
on() metodu bir olay dinleyicisi ekler.Aşağıdaki örneklerin üçünde de 'foo' olayı dinleniyor ve bu olay tetiklendiğinde konsola bir msj yazdırılıyor. İlk iki olay parametre beklemeyen bir callback' i tetiklerken üçüncü olayın callback'i a parametresinin geçilmesini bekler. Konsola mesajların yazılmasıyla foo olaylarının tetiklendiğini ve callback fonksiyonların çalıştırıldığını anlayacağız.Çıktılardan görüldüğü gibi callback fonksiyonlar yukarıdan aşağıya sırayla çağrılıyor.

*/
myEmitter.on('foo', () => console.log('foo olayı tetiklendi - 1'));
myEmitter.on('foo', () => console.log('foo olayı tetiklendi - 2'));
myEmitter.on('foo', (a) => {
  console.log('parametreli foo olayı tetiklendi - 3')
  console.log('a parametresi: ', a)
});

console.log("myEmitter: ", myEmitter)
//? Aşağıdaki çıktıdan da görüleceği gibi on('foo', () => ..) metodu çağrıldığında EventEmitter nesnesine dizi tutan bir foo özelliği ekleniyor ve callback fonksiyonunu bu diziye eleman olarak koyuyor. Sonraki her on('foo', () => ..) çağrıları bu diziye kendi callback' lerini ekliyor.
/*
EventEmitter {
  _events: [Object: null prototype] {
    foo: [
      [Function (anonymous)],
      [Function (anonymous)],
      [Function (anonymous)]
    ]
  },
  _eventsCount: 1,
  _maxListeners: undefined,
  [Symbol(shapeMode)]: false,
  [Symbol(kCapture)]: false
}
*/

//'foo' olayını emit() fonksiyonu ile iki defa yayınlıyoruz. İkincisinde bir parametre de geçiyoruz. Bir olayı emit ettiğinizde o olayla ilişkilendirilmiş tüm callback' ler tanımlanma sırasına göre çalıştırılır. foo olayı için yukarıda üç dinleyici ve üç callback tanımladığımız için bu üç callback de, foo olayı emit edildikten sonra çağrılacaktır.
myEmitter.emit('foo')
myEmitter.emit('foo', 'some text')

//1. emit()' in ÇIKTILARI
// foo olayı tetiklendi - 1
// foo olayı tetiklendi - 2
// parametreli foo olayı tetiklendi - 3
// a parametresi:  undefined

//2. emit()' in ÇIKTILARI
// foo olayı tetiklendi - 1
// foo olayı tetiklendi - 2
// parametreli foo olayı tetiklendi - 3
// a parametresi:  some text

myEmitter.on('bar', () => console.log('bar olayı tetiklendi'))

console.log("myEmitter: ", myEmitter)
//? Aşağıdaki çıktıda foo dan sonra bir de bar öz. ekleniği görülüyor. Demek ki dinlenen her olay için _events nesnesine o olayın adıyla bir öz. ekleniyor ve olay için tanımlanmış her bir callback de diziye alınıyor. Ayrıca _eventsCount değeri de 1' den 2' ye çıktı. Bu da sanırım olay türü adedini tutuyor.
/*
EventEmitter {
  _events: [Object: null prototype] {
    foo: [
      [Function (anonymous)],
      [Function (anonymous)],
      [Function (anonymous)]
    ],
    bar: [Function (anonymous)]
  },
  _eventsCount: 2,
  _maxListeners: undefined,
  [Symbol(shapeMode)]: false,
  [Symbol(kCapture)]: false
}


*/

//bar olayı emit edildiğinde sadece üstteki dinleyicinin callback' i çalışır. foo olay dinleyicilerinin callback' leri çalışmaz.

myEmitter.once('bar', () => console.log('once ile dinlenen bar olayı tetiklendi'))
myEmitter.emit('bar')

console.log("myEmitter: ", myEmitter)

myEmitter.emit('bar')//bar olayı ikinci kez emit edildiğinde once ile dinlenen bar olay işleyici fonksiyonları çalıştırılmaz. Zira 78. satırdaki ilk emit de, bir kez çalıştırılmıştı ve bundan sonra bar dizisinden bu callback çıkarıldı. Bu yüzden satırdaki emit te çalıştırılmadı. on() ile dinlenen olayların callback' leri ise her emit' te çalıştırılır.