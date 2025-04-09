 {
                  matches.playermode === 'squad'?
                  <View style={{gap:20,marginTop:20}}>
                    {
                      matches.gameName.map((item)=>(
                        <View key={item._id} style={{flexDirection:'row',alignItems:'center',gap:30}}>
                          <View>
                          <Text>{item.player1}</Text>
                          <Text>{item.player2 || "player2 Name Unknown"}</Text>
                          <Text>{item.player3||"player3 Name Unknown"}</Text>
                          <Text>{item.player4||"player4 Name Unknown"}</Text>
                          </View>
                          <TouchableOpacity style={{width:40,height:30,backgroundColor:"gray",alignItems:'center',justifyContent:'center'}} onPress={()=>reportplayers(item.userid)}>
                            <Text style={{color:'white'}}>+</Text>
                          </TouchableOpacity>
                          </View>
                      ))
                    }
                  </View>:<View style={{gap:20,marginTop:20}}>
                    {
                      matches.gameName.map((item)=>(
                        <View key={item._id} style={{flexDirection:'row',alignItems:'center',gap:30}}>
                          <View>
                          <Text>{item.player1}</Text>
                          </View>
                          <TouchableOpacity style={{width:40,height:30,backgroundColor:"gray",alignItems:'center',justifyContent:'center'}} onPress={()=>reportplayers(item.userid)}>
                            <Text style={{color:'white'}}>+</Text>
                          </TouchableOpacity>
                          </View>
                      ))
                    }
                  </View>
                  }
